import os
from pathlib import Path
from dotenv import load_dotenv

# 현재 환경변수 초기화
for key in ['OPENAI_API_KEY', 'GEMINI_API_KEY', 'GOOGLE_API_KEY', 'LLM_SOURCE', 'BIOMNI_LLM']:
    os.environ.pop(key, None)

# .env 파일 강제 로드 (기존 환경변수 덮어쓰기)
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path, override=True)



# 주요 환경변수 확인
env_vars = [
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY", 
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "LLM_SOURCE",
    "BIOMNI_LLM",
    "BASE_SEPOLIA_RPC_URL",
    "RESEARCH_REGISTRY_ADDRESS"
]

print("=" * 60)
print("환경변수 로드 확인")
print("=" * 60)

for var in env_vars:
    value = os.getenv(var)
    if value:
        # 민감한 키는 앞부분만 표시
        if "KEY" in var or "PRIVATE" in var:
            display_value = f"{value[:10]}...{value[-4:]}" if len(value) > 14 else "***"
        else:
            display_value = value
        print(f"✅ {var}: {display_value}")
    else:
        print(f"❌ {var}: NOT SET")

print("=" * 60)
print("\n.env 파일 위치:", os.path.abspath(".env"))
print("현재 작업 디렉토리:", os.getcwd())
print("=" * 60)

