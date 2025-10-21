# BV_BNB Backend Server 설정 가이드

이 문서는 BV_BNB 백엔드 서버의 가상환경 설정, 의존성 설치, 환경변수 구성 및 실행 방법을 안내합니다.

---

## 목차

1. [사전 요구사항](#사전-요구사항)
2. [초기 설정](#초기-설정)
3. [환경변수 설정](#환경변수-설정)
4. [서버 실행](#서버-실행)
5. [가상환경 재설정](#가상환경-재설정)
6. [문제 해결](#문제-해결)

---

## 사전 요구사항

### Python 버전

- Python 3.10 이상 권장
- 확인: `python --version` (Windows) 또는 `python3 --version` (macOS/Linux)

### 필수 도구

- `pip`: Python 패키지 관리자
- `venv`: 가상환경 모듈 (Python 3.3+ 기본 포함)

### 운영체제별 준비

- **Windows**: PowerShell 5.1 이상
- **macOS/Linux**: bash 또는 zsh

---

## 초기 설정

### 1. 작업 디렉토리 이동

```bash
cd packages/backend/server
```

### 2. 가상환경 생성

#### Windows (PowerShell)

```powershell
python -m venv .venv
```

#### macOS / Linux

```bash
python3 -m venv .venv
```

### 3. 가상환경 활성화

#### Windows (PowerShell)

```powershell
.\.venv\Scripts\Activate.ps1
```

**실행 정책 오류 발생 시:**

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

#### macOS / Linux

```bash
source .venv/bin/activate
```

### 4. pip 업그레이드!

```bash
pip install --upgrade pip
```

### 5. 의존성 설치

#### 서버 의존성

```bash
pip install -r requirements.txt
```

#### Biomni 에이전트 (로컬 editable 설치)

```bash
pip install -e ../Biomni
```

---

## 환경변수 설정

### 1. .env 파일 생성

`packages/backend/server/.env` 파일을 생성하고 아래 내용을 입력합니다.

```bash
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# LLM 설정
LLM_SOURCE=OpenAI
BIOMNI_LLM=gpt-4o-mini

# Biomni 설정
BIOMNI_DATA_PATH=./data
BIOMNI_TIMEOUT_SECONDS=1200
BIOMNI_USE_TOOL_RETRIEVER=true

# 서버 설정
HOST=0.0.0.0
PORT=8000

# 블록체인 설정 (Base Sepolia)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
RESEARCH_REGISTRY_ADDRESS=0x7b26C4645CD5C76bd0A8183DcCf8eAB9217C1Baf
SERVER_PRIVATE_KEY=your_private_key_here
```

### 2. 환경변수 확인 (선택)

```bash
python check_env.py
```

---

## 서버 실행

### Windows (PowerShell)

#### 방법 1: 스크립트 사용 (권장)

```powershell
.\start_server.ps1
```

#### 방법 2: 직접 실행

```powershell
# 환경변수 설정
$env:OPENAI_API_KEY="your_key_here"
$env:LLM_SOURCE="OpenAI"
$env:BIOMNI_LLM="gpt-4o-mini"

# 가상환경 활성화
.\.venv\Scripts\Activate.ps1

# 서버 시작
python main.py
```

### macOS / Linux

#### 방법 1: 스크립트 사용 (권장)

```bash
chmod +x start_server.sh
./start_server.sh
```

#### 방법 2: 직접 실행

```bash
# 가상환경 활성화
source .venv/bin/activate

# .env 로드
set -a
source .env
set +a

# 서버 시작
python3 main.py
```

### 서버 접속 확인

- 브라우저에서 http://localhost:8000/docs 접속
- FastAPI Swagger UI가 표시되면 정상 동작

---

## 가상환경 재설정

의존성 충돌이나 오류가 발생할 경우 가상환경을 완전히 삭제하고 재설치합니다.

### Windows (PowerShell)

```powershell
# 1. 가상환경 비활성화
deactivate

# 2. 가상환경 폴더 삭제
Remove-Item -Recurse -Force .venv

# 3. 새 가상환경 생성
python -m venv .venv

# 4. 활성화
.\.venv\Scripts\Activate.ps1

# 5. 의존성 재설치
pip install --upgrade pip
pip install -r requirements.txt
pip install -e ../Biomni

# 6. 서버 실행
python main.py
```

### macOS / Linux

```bash
# 1. 가상환경 비활성화 (자동)

# 2. 가상환경 폴더 삭제
rm -rf .venv

# 3. 새 가상환경 생성
python3 -m venv .venv

# 4. 활성화
source .venv/bin/activate

# 5. 의존성 재설치
pip install --upgrade pip
pip install -r requirements.txt
pip install -e ../Biomni

# 6. 서버 실행
./start_server.sh
```

---

## 문제 해결

### 1. `ModuleNotFoundError: No module named 'XXX'`

**원인**: 필요한 패키지가 설치되지 않음

**해결**:

```bash
pip install -r requirements.txt
pip install -e ../Biomni
```

### 2. `OPENAI_API_KEY 환경 변수가 설정되어 있지 않습니다`

**원인**: 환경변수가 로드되지 않음

**해결**:

- `.env` 파일이 `packages/backend/server/.env` 위치에 있는지 확인
- `OPENAI_API_KEY` 값이 올바르게 설정되었는지 확인
- 터미널을 완전히 닫고 다시 열어 실행

### 3. PowerShell 실행 정책 오류

**오류 메시지**: `... cannot be loaded because running scripts is disabled on this system`

**해결**:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

### 4. 포트 충돌 (Port already in use)

**원인**: 8000 포트가 이미 사용 중

**해결**:

- `.env`에서 `PORT` 값을 다른 번호로 변경 (예: `PORT=8001`)
- 또는 실행 중인 프로세스 종료

### 5. Biomni 데이터 다운로드 실패

**원인**: 네트워크 문제 또는 데이터 경로 오류

**해결**:

```bash
# BIOMNI_DATA_PATH 확인
echo $BIOMNI_DATA_PATH  # Linux/macOS
echo $env:BIOMNI_DATA_PATH  # Windows

# 수동 다운로드 (필요시)
python -c "from biomni.utils import download_data; download_data()"
```

### 6. 블록체인 트랜잭션 실패

**원인**: 가스 부족, RPC 연결 실패, 잘못된 프라이빗 키

**해결**:

- `.env`의 `BASE_SEPOLIA_RPC_URL` 확인
- `SERVER_PRIVATE_KEY`가 올바른지 확인 (0x 제외)
- 테스트넷 ETH 잔액 확인: https://sepolia.basescan.org
- 무료 faucet: https://www.alchemy.com/faucets/base-sepolia

### 7. 가상환경이 활성화되지 않음

**확인 방법**:

- 터미널 프롬프트 앞에 `(.venv)` 표시 확인

**해결**:

```bash
# Windows
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

---

## 참고 자료

### 주요 의존성

- FastAPI 0.115.0: https://fastapi.tiangolo.com
- Biomni (로컬): AI 에이전트 프레임워크
- OpenAI Python SDK: https://github.com/openai/openai-python
- web3.py: https://web3py.readthedocs.io

### 관련 문서

- [README.md](./README.md): 프로젝트 개요
- [env.template](./env.template): 환경변수 템플릿
- [requirements.txt](./requirements.txt): Python 의존성 목록
