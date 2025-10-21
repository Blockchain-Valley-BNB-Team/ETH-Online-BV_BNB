# Gene Analysis Backend Server

Biomni AI 에이전트를 활용한 유전자 분석 백엔드 서버입니다. FastAPI 기반으로 실시간 스트리밍 채팅 API를 제공하고, 연구 결과를 Base Sepolia 블록체인에 저장합니다.

## 주요 기능

- **Biomni AI 에이전트 통합**: 바이오메디컬 연구를 위한 AI 에이전트 직접 연동
- **실시간 스트리밍**: Server-Sent Events (SSE)를 통한 실시간 응답 스트리밍
- **블록체인 저장**: Base Sepolia 체인에 연구 결과 영구 저장
- **세션 관리**: 메모리 기반 채팅 세션 관리

## 기술 스택

- **FastAPI**: 고성능 비동기 웹 프레임워크
- **Biomni**: 바이오메디컬 AI 에이전트
- **Web3.py**: 이더리움 블록체인 통합
- **SSE (Server-Sent Events)**: 실시간 스트리밍

## 설치 방법

### 1. Python 가상환경 생성

```powershell
# PowerShell에서 실행
Set-Location "packages\backend\server"

# Python 3.11 이상 권장
py -3.11 -m venv .venv

# 가상환경 활성화
.\.venv\Scripts\Activate.ps1
```

### 2. 의존성 설치

```powershell
# 기본 패키지 설치
pip install -r requirements.txt

# Biomni 설치 (로컬)
pip install -e ../Biomni
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 실제 값으로 수정합니다:

```powershell
Copy-Item .env.example .env
```

`.env` 파일을 편집하여 다음 값들을 설정합니다:

```env
# 필수: LLM API 키 (Anthropic 또는 OpenAI)
ANTHROPIC_API_KEY=sk-ant-xxxxx
# 또는
OPENAI_API_KEY=sk-xxxxx

# 블록체인 설정 (컨트랙트 배포 후)
RESEARCH_REGISTRY_ADDRESS=0x...
SERVER_PRIVATE_KEY=0x...
```

## 실행 방법

### 개발 모드로 실행

```powershell
# 가상환경이 활성화된 상태에서
uvicorn main:app --reload --port 8000
```

또는 Python으로 직접 실행:

```powershell
python main.py
```

서버가 시작되면 다음 주소에서 접근할 수 있습니다:

- **API**: http://localhost:8000
- **문서 (Swagger UI)**: http://localhost:8000/docs
- **헬스 체크**: http://localhost:8000/health

## API 엔드포인트

### 1. 세션 생성

새로운 채팅 세션을 생성합니다.

```http
POST /api/chat/sessions
```

**응답:**

```json
{
  "session_id": "uuid-string",
  "created_at": "2025-10-20T10:30:00"
}
```

### 2. 메시지 전송 (SSE 스트리밍)

사용자 메시지를 전송하고 실시간으로 응답을 받습니다.

```http
POST /api/chat/send
Content-Type: application/json

{
  "session_id": "uuid-string",
  "message": "BRCA1 유전자의 기능을 설명해주세요",
  "user_address": "0x..."
}
```

**SSE 이벤트:**

- `message`: 에이전트 로그 및 결과
- `storing`: 블록체인 저장 시작
- `blockchain`: 블록체인 저장 결과 (트랜잭션 해시)
- `done`: 완료

### 3. 세션 조회

```http
GET /api/chat/sessions/{session_id}
```

### 4. 세션 삭제

```http
DELETE /api/chat/sessions/{session_id}
```

### 5. 헬스 체크

```http
GET /health
```

## 프론트엔드 연동 예시

```typescript
// 세션 생성
const sessionResponse = await fetch("http://localhost:8000/api/chat/sessions", {
  method: "POST",
});
const { session_id } = await sessionResponse.json();

// SSE 연결
const eventSource = new EventSource("http://localhost:8000/api/chat/send");

eventSource.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log("Agent message:", data);
  // UI 업데이트
});

eventSource.addEventListener("blockchain", (event) => {
  const { transaction_hash, research_id } = JSON.parse(event.data);
  console.log("Blockchain result:", transaction_hash);
  // 트랜잭션 해시 표시
  const explorerUrl = `https://sepolia.basescan.org/tx/${transaction_hash}`;
});

eventSource.addEventListener("done", () => {
  console.log("Completed");
  eventSource.close();
});
```

## 블록체인 설정

### 1. 스마트 컨트랙트 배포

```powershell
# packages/hardhat 디렉토리에서
Set-Location "..\..\hardhat"

# Hardhat 로컬 네트워크에 배포
yarn deploy

# Base Sepolia에 배포
yarn deploy --network baseSepolia
```

### 2. 컨트랙트 주소 업데이트

배포 후 출력되는 컨트랙트 주소를 `.env` 파일의 `RESEARCH_REGISTRY_ADDRESS`에 입력합니다.

### 3. 서버 지갑 설정

트랜잭션을 전송할 서버 지갑의 개인키를 `.env` 파일의 `SERVER_PRIVATE_KEY`에 입력합니다.

⚠️ **보안 주의**: 실제 배포 시에는 환경 변수를 안전하게 관리하세요.

## 문제 해결

### Biomni 설치 오류

```powershell
# Biomni 환경이 설정되지 않은 경우
Set-Location "../Biomni/biomni_env"
.\setup.sh  # Linux/Mac
# 또는 Windows의 경우 문서 참조
```

### 블록체인 연결 오류

- RPC URL 확인: `BASE_SEPOLIA_RPC_URL`이 올바른지 확인
- 서버 지갑 잔액 확인: 가스비를 지불할 수 있는 충분한 ETH가 있는지 확인
- 컨트랙트 주소 확인: `RESEARCH_REGISTRY_ADDRESS`가 올바르게 설정되었는지 확인

### SSE 연결 오류

- CORS 설정 확인: `.env`의 `CORS_ORIGINS`에 프론트엔드 주소가 포함되어 있는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 개발 팁

### API 문서 확인

서버 실행 후 http://localhost:8000/docs 에서 Swagger UI를 통해 모든 API를 테스트할 수 있습니다.

### 로그 확인

서버 콘솔에서 실시간으로 요청/응답 로그를 확인할 수 있습니다:

```powershell
uvicorn main:app --reload --log-level debug
```

### 테스트

```powershell
# 헬스 체크
Invoke-WebRequest -Uri "http://localhost:8000/health"

# 세션 생성
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/chat/sessions" -Method POST
$sessionId = ($response.Content | ConvertFrom-Json).session_id
```

## 라이선스

이 프로젝트는 Biomni의 라이선스를 따릅니다. 상업적 사용 시 각 컴포넌트의 라이선스를 확인하세요.

## 문의

문제가 발생하거나 기능 제안이 있으시면 GitHub 이슈를 생성해주세요.
