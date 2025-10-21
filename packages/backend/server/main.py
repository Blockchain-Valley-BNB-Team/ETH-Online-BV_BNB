"""
Gene Analysis Backend - FastAPI Server
Biomni AI 에이전트를 활용한 유전자 분석 백엔드 서버
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from dotenv import load_dotenv
import json
import os
from datetime import datetime

from models import (
    ChatRequest,
    SessionCreateResponse,
    SessionResponse,
    HealthCheckResponse
)
from agent_service import BiomniAgentService
from blockchain_service import BlockchainService

# 환경 변수 로드
load_dotenv()

# FastAPI 앱 생성
app = FastAPI(
    title="Gene Analysis Backend",
    description="Biomni AI 에이전트 기반 유전자 분석 백엔드 API",
    version="1.0.0"
)

# CORS 설정
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 초기화
agent_service = BiomniAgentService()
blockchain_service = BlockchainService()


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "Gene Analysis Backend API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.post("/api/chat/send")
async def send_message(request: ChatRequest):
    """
    메시지 전송 및 SSE 스트리밍 응답
    
    Args:
        request: 채팅 요청 (session_id, message, user_address 포함)
        
    Returns:
        EventSourceResponse: SSE 스트리밍 응답
    """
    
    async def event_generator():
        """SSE 이벤트 생성기"""
        result_text = ""
        has_error = False
        
        try:
            print(f"Starting chat request - Session: {request.session_id}, User: {request.user_address}")
            
            # Biomni 에이전트 응답 스트리밍
            async for chunk in agent_service.stream_response(
                request.session_id,
                request.message,
                request.config
            ):
                # 에러 체크
                if chunk["type"] == "error":
                    has_error = True
                
                # 최종 결과 저장
                if chunk["type"] == "result":
                    result_text = chunk["content"]
                    print(f"Received result from agent (length: {len(result_text)})")
                
                # 메시지 이벤트 전송
                yield {
                    "event": "message",
                    "data": json.dumps(chunk)
                }
            
            # 에러가 발생했거나 결과가 비어있으면 블록체인 저장 건너뛰기
            if has_error or not result_text or len(result_text.strip()) < 10:
                print(f"Skipping blockchain storage - Error: {has_error}, Result empty: {not result_text}")
                yield {
                    "event": "done",
                    "data": json.dumps({
                        "status": "completed_without_blockchain",
                        "timestamp": datetime.now().isoformat()
                    })
                }
                return
            
            # 블록체인에 저장 중 알림
            print("Starting blockchain storage...")
            yield {
                "event": "storing",
                "data": json.dumps({
                    "status": "storing_to_blockchain",
                    "message": "연구 결과를 블록체인에 저장하는 중...",
                    "timestamp": datetime.now().isoformat()
                })
            }
            
            # 블록체인에 저장
            try:
                blockchain_result = await blockchain_service.store_research(
                    researcher_address=request.user_address,
                    result_data=result_text,
                    session_id=request.session_id
                )
                
                print(f"Blockchain storage successful - TX: {blockchain_result['transaction_hash']}")
                
                # 블록체인 결과 전송
                yield {
                    "event": "blockchain",
                    "data": json.dumps(blockchain_result)
                }
                
            except Exception as e:
                error_msg = f"Blockchain storage failed: {str(e)}"
                print(error_msg)
                
                yield {
                    "event": "blockchain_error",
                    "data": json.dumps({
                        "error": error_msg,
                        "timestamp": datetime.now().isoformat()
                    })
                }
            
            # 완료 이벤트
            yield {
                "event": "done",
                "data": json.dumps({
                    "status": "completed",
                    "timestamp": datetime.now().isoformat()
                })
            }
            
        except Exception as e:
            error_msg = f"Error processing request: {str(e)}"
            print(error_msg)
            
            yield {
                "event": "error",
                "data": json.dumps({
                    "error": error_msg,
                    "timestamp": datetime.now().isoformat()
                })
            }
    
    return EventSourceResponse(event_generator())


@app.post("/api/chat/sessions", response_model=SessionCreateResponse)
async def create_session():
    """
    새 채팅 세션 생성
    
    Returns:
        SessionCreateResponse: 생성된 세션 정보
    """
    session_id = agent_service.create_session()
    return SessionCreateResponse(
        session_id=session_id,
        created_at=datetime.now()
    )


@app.get("/api/chat/sessions/{session_id}")
async def get_session(session_id: str):
    """
    세션 조회
    
    Args:
        session_id: 세션 ID
        
    Returns:
        dict: 세션 데이터
        
    Raises:
        HTTPException: 세션을 찾을 수 없는 경우
    """
    session = agent_service.get_session(session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session


@app.delete("/api/chat/sessions/{session_id}")
async def delete_session(session_id: str):
    """
    세션 삭제
    
    Args:
        session_id: 세션 ID
        
    Returns:
        dict: 삭제 결과
    """
    success = agent_service.delete_session(session_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"status": "deleted", "session_id": session_id}


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    서버 상태 체크
    
    Returns:
        HealthCheckResponse: 서버 및 블록체인 연결 상태
    """
    return HealthCheckResponse(
        status="healthy",
        blockchain_connected=blockchain_service.is_connected(),
        timestamp=datetime.now()
    )


@app.get("/api/stats")
async def get_stats():
    """
    서버 통계 조회
    
    Returns:
        dict: 서버 통계
    """
    return {
        "active_sessions": agent_service.get_session_count(),
        "blockchain_connected": blockchain_service.is_connected(),
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    print(f"Starting Gene Analysis Backend on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )

