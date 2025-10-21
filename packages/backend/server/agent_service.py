"""
Biomni Agent 서비스
Biomni AI 에이전트를 래핑하고 세션을 관리
"""

from typing import Dict, AsyncGenerator
import uuid
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Biomni 임포트 시도
try:
    from biomni.agent import A1
    from biomni.config import default_config
    BIOMNI_AVAILABLE = True
except ImportError:
    print("Warning: Biomni not installed. Agent features will be disabled.")
    BIOMNI_AVAILABLE = False


class BiomniAgentService:
    """Biomni AI 에이전트 서비스"""
    
    def __init__(self):
        """에이전트 서비스 초기화"""
        self.sessions: Dict[str, dict] = {}
        self.agent = None
        self.executor = ThreadPoolExecutor(max_workers=1)
    
    def _get_agent(self, config=None):
        """
        Biomni 에이전트 인스턴스 가져오기
        싱글톤 패턴으로 하나의 에이전트만 사용
        """
        if not BIOMNI_AVAILABLE:
            raise Exception("Biomni is not installed")
        
        if self.agent is None:
            llm = config.llm if config else "gemini-2.5-flash-lite"
            data_path = "./data"
            use_tool_retriever = config.use_tool_retriever if config and hasattr(config, 'use_tool_retriever') else True
            timeout_seconds = config.timeout_seconds if config and hasattr(config, 'timeout_seconds') else 1200
            
            print(f"Initializing Biomni agent with LLM: {llm}")
            print(f"Data path: {data_path}")
            print(f"Use tool retriever: {use_tool_retriever}")
            print(f"Timeout: {timeout_seconds}s")
            
            # IMPORTANT: Configure default_config for ALL operations (agent + database queries)
            # According to Biomni docs, direct A1() params only affect agent reasoning
            default_config.llm = llm
            default_config.source = "Gemini"
            default_config.timeout_seconds = timeout_seconds
            default_config.use_tool_retriever = use_tool_retriever
            default_config.path = data_path
            
            print("✅ default_config updated for consistent Gemini usage")
            
            # Biomni A1 에이전트 초기화
            # default_config를 사용하므로 파라미터 없이 초기화
            self.agent = A1()
            
            # 에이전트 설정 (self_critic 모드)
            self.agent.configure(
                self_critic=False,          # 자기 비평 모드
                test_time_scale_round=0     # 테스트 타임 스케일링 라운드 수
            )
            
            print("✅ Biomni agent initialized successfully")
        
        return self.agent
    
    def create_session(self) -> str:
        """
        새 채팅 세션 생성
        
        Returns:
            str: 생성된 세션 ID
        """
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "messages": [],
            "created_at": datetime.now()
        }
        print(f"Session created: {session_id}")
        return session_id
    
    def get_session(self, session_id: str) -> dict:
        """
        세션 조회
        
        Args:
            session_id: 세션 ID
            
        Returns:
            dict: 세션 데이터
        """
        return self.sessions.get(session_id)
    
    def delete_session(self, session_id: str) -> bool:
        """
        세션 삭제
        
        Args:
            session_id: 세션 ID
            
        Returns:
            bool: 삭제 성공 여부
        """
        if session_id in self.sessions:
            del self.sessions[session_id]
            print(f"Session deleted: {session_id}")
            return True
        return False
    
    async def stream_response(
        self,
        session_id: str,
        message: str,
        config=None
    ) -> AsyncGenerator[dict, None]:
        """
        Biomni 에이전트 응답을 스트리밍으로 전달
        
        Args:
            session_id: 세션 ID
            message: 사용자 메시지
            config: 에이전트 설정 (선택)
            
        Yields:
            dict: 스트리밍 청크
        """
        # 세션 확인
        if session_id not in self.sessions:
            yield {
                "type": "error",
                "content": "Session not found",
                "timestamp": datetime.now().isoformat()
            }
            return
        
        # 사용자 메시지 저장
        self.sessions[session_id]["messages"].append({
            "role": "user",
            "content": message,
            "timestamp": datetime.now()
        })
        
        try:
            # 에이전트 가져오기
            agent = self._get_agent(config)
            
            # 시작 메시지
            print(f"[Session {session_id}] Starting Biomni agent for message: {message[:100]}...")
            yield {
                "type": "start",
                "content": "Biomni agent 실행 중... 유전자 분석을 시작합니다.",
                "timestamp": datetime.now().isoformat()
            }
            
            # agent.go()는 동기 함수이므로 ThreadPoolExecutor에서 실행
            print(f"[Session {session_id}] Executing agent.go()...")
            loop = asyncio.get_event_loop()
            log, final_result = await loop.run_in_executor(
                self.executor,
                agent.go,
                message
            )
            
            print(f"[Session {session_id}] Agent execution completed")
            print(f"[Session {session_id}] Log entries: {len(log)}")
            print(f"[Session {session_id}] Result length: {len(final_result) if final_result else 0}")
            
            # 결과 검증
            if not final_result or len(final_result.strip()) == 0:
                error_msg = "Biomni agent returned empty result"
                print(f"[Session {session_id}] ERROR: {error_msg}")
                yield {
                    "type": "error",
                    "content": "연구 결과를 생성하지 못했습니다. 다시 시도해주세요.",
                    "timestamp": datetime.now().isoformat()
                }
                return
            
            # 로그를 청크 단위로 스트리밍
            for i, entry in enumerate(log):
                chunk = {
                    "type": "log",
                    "content": str(entry),
                    "index": i,
                    "timestamp": datetime.now().isoformat()
                }
                yield chunk
                
                # 너무 빠르게 전송되지 않도록 약간의 지연
                await asyncio.sleep(0.05)
            
            # 최종 결과 전송
            print(f"[Session {session_id}] Sending final result to client")
            yield {
                "type": "result",
                "content": final_result,
                "timestamp": datetime.now().isoformat()
            }
            
            # 결과를 세션에 저장
            full_log = "\n".join([str(entry) for entry in log])
            self.sessions[session_id]["messages"].append({
                "role": "assistant",
                "content": final_result,
                "full_log": full_log,
                "timestamp": datetime.now()
            })
            
            print(f"[Session {session_id}] Research completed successfully")
            
        except Exception as e:
            import traceback
            error_msg = f"Agent error: {str(e)}"
            traceback_str = traceback.format_exc()
            
            print("=" * 80)
            print(f"[Session {session_id}] AGENT ERROR:")
            print(error_msg)
            print("Traceback:")
            print(traceback_str)
            print("=" * 80)
            
            yield {
                "type": "error",
                "content": f"에이전트 실행 중 오류가 발생했습니다: {error_msg}",
                "timestamp": datetime.now().isoformat()
            }
    
    def get_session_count(self) -> int:
        """활성 세션 개수 조회"""
        return len(self.sessions)

