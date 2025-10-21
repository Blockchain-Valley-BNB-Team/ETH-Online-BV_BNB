# Gene Analysis Backend Server 시작 스크립트

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Gene Analysis Backend Server" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 가상환경 활성화
Write-Host "가상환경 활성화 중..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Python 경로 확인
Write-Host "Python 경로: $(python -c 'import sys; print(sys.executable)')" -ForegroundColor Green

# Biomni 확인
Write-Host ""
Write-Host "Biomni 확인 중..." -ForegroundColor Yellow
python -c "from biomni.agent import A1; print('✅ Biomni가 정상적으로 로드되었습니다!')"

# 서버 시작
Write-Host ""
Write-Host "FastAPI 서버를 시작합니다..." -ForegroundColor Yellow
Write-Host "URL: http://localhost:8000" -ForegroundColor Green
Write-Host "문서: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000

