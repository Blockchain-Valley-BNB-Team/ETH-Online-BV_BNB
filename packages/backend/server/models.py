"""
Pydantic 모델 정의
Gene Analysis Backend의 요청/응답 데이터 모델
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class ChatMessage(BaseModel):
    """채팅 메시지 모델"""
    role: str = Field(..., description="메시지 역할 (user 또는 assistant)")
    content: str = Field(..., description="메시지 내용")
    timestamp: datetime = Field(default_factory=datetime.now, description="메시지 생성 시간")


class AgentConfig(BaseModel):
    """Biomni 에이전트 설정"""
    llm: str = Field(default="gpt-5-mini", description="사용할 LLM 모델")
    timeout_seconds: int = Field(default=1200, description="타임아웃 시간 (초)")
    use_tool_retriever: bool = Field(default=True, description="도구 검색 사용 여부")


class ChatRequest(BaseModel):
    """채팅 요청 모델"""
    session_id: str = Field(..., description="세션 ID")
    message: str = Field(..., description="사용자 메시지")
    user_address: str = Field(..., description="사용자 지갑 주소")
    config: Optional[AgentConfig] = Field(default=None, description="에이전트 설정 (선택사항)")


class BlockchainResult(BaseModel):
    """블록체인 저장 결과"""
    transaction_hash: str = Field(..., description="트랜잭션 해시")
    research_id: int = Field(..., description="연구 ID")
    gas_used: int = Field(..., description="사용된 가스")
    block_number: int = Field(..., description="블록 번호")


class ChatResponse(BaseModel):
    """채팅 응답 모델"""
    session_id: str = Field(..., description="세션 ID")
    result: str = Field(..., description="연구 결과")
    blockchain: BlockchainResult = Field(..., description="블록체인 저장 결과")
    timestamp: datetime = Field(default_factory=datetime.now, description="응답 생성 시간")


class SessionResponse(BaseModel):
    """세션 응답 모델"""
    session_id: str = Field(..., description="세션 ID")
    messages: List[ChatMessage] = Field(default=[], description="메시지 목록")
    created_at: datetime = Field(..., description="세션 생성 시간")


class SessionCreateResponse(BaseModel):
    """세션 생성 응답"""
    session_id: str = Field(..., description="생성된 세션 ID")
    created_at: datetime = Field(default_factory=datetime.now, description="생성 시간")


class HealthCheckResponse(BaseModel):
    """헬스 체크 응답"""
    status: str = Field(..., description="서버 상태")
    blockchain_connected: bool = Field(..., description="블록체인 연결 상태")
    timestamp: datetime = Field(default_factory=datetime.now, description="체크 시간")

