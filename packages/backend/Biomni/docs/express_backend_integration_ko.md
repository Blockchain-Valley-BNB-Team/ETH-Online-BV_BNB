### Biomni 통합 가이드 (Windows + Express 백엔드, 원클릭 설치/연결)

> 목표: 기존 Express(익스프레스) 백엔드에 Biomni 에이전트를 최소 변경으로 붙이고, PowerShell 기준 "원클릭(원커맨드)" 의존성 설치와 연결을 완료합니다. 기본 통신은 MCP(Model Context Protocol) stdio 방식으로 진행합니다.

---

### 1) 개요와 아키텍처

- **구성 요약**

  - Express 백엔드(Node.js) → MCP JS Client → (stdio) → Python Biomni MCP Server → Biomni 툴 실행
  - Python 쪽은 Biomni 레포에 포함된 `create_mcp_server()`를 사용해 MCP 서버를 구동합니다.

- **장점**
  - 표준 프로토콜(MCP) 기반이라 언어/프로세스 경계를 안전하게 넘을 수 있음
  - 서버 경량화: 필요한 모듈만 노출 가능(`tool_modules`)

---

### 2) 요구사항

- Windows 11, PowerShell 7.x 이상(pwsh)
- Node.js 18 이상, npm 또는 pnpm
- Python 3.11 (권장)
- Git

권장 사전 점검(버전 확인):

```powershell
# PowerShell 환경 확인
pwsh --version
git --version
node --version
python --version
```

---

### 3) 원클릭 설치 스크립트 (PowerShell)

다음 스크립트를 프로젝트 루트에 `scripts\setup_biomni_express.ps1`로 저장 후 실행하세요. 관리자 권한이 필요한 경우 먼저 관리자 PowerShell을 실행하십시오.

```powershell
# NOTE: English comments in shell scripts to avoid encoding issues
param(
  [string]$BiomniPath = "D:\\Develop\\bot\\Biomni",   # Biomni 레포 절대경로
  [string]$NodeProjectPath = (Get-Location).Path,           # Express 백엔드 루트 경로
  [string]$PythonVersion = "3.11"
)

Write-Host "[1/6] Checking prerequisites..." -ForegroundColor Cyan

function Ensure-Program($name, $wingetId) {
  $exists = Get-Command $name -ErrorAction SilentlyContinue
  if (-not $exists) {
    Write-Host "Installing $name via winget..." -ForegroundColor Yellow
    Start-Process pwsh -Verb RunAs -ArgumentList "-NoProfile -Command winget install -e --id $wingetId -y" -Wait
  }
}

Ensure-Program python "Python.Python.$PythonVersion"
Ensure-Program git "Git.Git"
Ensure-Program node "OpenJS.NodeJS.LTS"

Write-Host "[2/6] Creating Python venv and installing Biomni..." -ForegroundColor Cyan

$venv = Join-Path $BiomniPath ".venv"
if (-not (Test-Path $venv)) {
  Push-Location $BiomniPath
  py -$PythonVersion -m venv .venv
  ."\.venv\Scripts\Activate.ps1"
  python -m pip install --upgrade pip
  # Biomni(현 레포) + MCP Python client
  pip install -e .
  pip install mcp
  Pop-Location
} else {
  Push-Location $BiomniPath
  ."\.venv\Scripts\Activate.ps1"
  pip install -e .
  pip install -U mcp
  Pop-Location
}

Write-Host "[3/6] Creating .env (Node) if missing..." -ForegroundColor Cyan

$dotenv = Join-Path $NodeProjectPath ".env"
if (-not (Test-Path $dotenv)) {
  @"
# Biomni / LLM keys (set at least one)
ANTHROPIC_API_KEY=YOUR_KEY_HERE
OPENAI_API_KEY=YOUR_KEY_HERE

# Biomni optional settings
BIOMNI_TIMEOUT_SECONDS=1200
BIOMNI_LLM=claude-3-5-sonnet-20241022

# Example: external services used by some tools
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
NCBI_EMAIL=YOUR_EMAIL@example.com
"@ | Out-File -FilePath $dotenv -Encoding UTF8 -Force
}

Write-Host "[4/6] Installing Node dependencies..." -ForegroundColor Cyan

Push-Location $NodeProjectPath
if (Test-Path "pnpm-lock.yaml") {
  pnpm add dotenv @modelcontextprotocol/sdk
} elseif (Test-Path "package.json") {
  npm install dotenv @modelcontextprotocol/sdk --save
} else {
  npm init -y
  npm install express dotenv @modelcontextprotocol/sdk --save
  npm install -D nodemon
}
Pop-Location

Write-Host "[5/6] Smoke test: spawn Biomni MCP server..." -ForegroundColor Cyan

$runner = @"
from biomni.agent.a1 import A1
agent = A1()
# 필요한 모듈만 노출: 예) database, genetics 등
mcp = agent.create_mcp_server(tool_modules=["biomni.tool.database"])
if __name__ == "__main__":
    print("Starting Biomni MCP server...")
    mcp.run(transport="stdio")
"@

$runnerPath = Join-Path $BiomniPath "run_mcp_server_for_express.py"
$runner | Out-File -FilePath $runnerPath -Encoding UTF8 -Force

Write-Host "[6/6] Done. Next: wire Express to MCP server." -ForegroundColor Green
```

설명: 위 스크립트는 Python venv 생성 → Biomni + MCP 설치 → Node 의존성 설치 → MCP 서버 런너 파일 생성까지 자동화합니다.

참고(선택): Bash 환경 예시

```bash
# (Reference) Bash only
python3.11 -m venv .venv && source .venv/bin/activate
pip install -e . && pip install mcp
npm i -S dotenv @modelcontextprotocol/sdk
```

---

### 4) Express에서 MCP 서버 연결 샘플

아래는 Node/Express가 Python의 Biomni MCP 서버를 stdio로 스폰(spawn)하고, MCP JS SDK로 툴을 호출하는 최소 예시입니다.

```javascript
// src/biomniMcp.js
require("dotenv").config();
const path = require("path");
const { spawn } = require("child_process");
const {
  StdioServerTransport,
  McpClient,
} = require("@modelcontextprotocol/sdk");

// Biomni 레포 경로와 런너 스크립트
const BIOMNI_PATH = process.env.BIOMNI_PATH || "D\\\\Develop\\\\bot\\\\Biomni";
const PYTHON =
  process.env.BIOMNI_PYTHON ||
  path.join(BIOMNI_PATH, ".venv", "Scripts", "python.exe");
const SERVER_SCRIPT =
  process.env.BIOMNI_RUNNER ||
  path.join(BIOMNI_PATH, "run_mcp_server_for_express.py");

let client;

async function startMcp() {
  // 환경변수 전달 (LLM 키 등)
  const env = { ...process.env };

  const child = spawn(PYTHON, [SERVER_SCRIPT], {
    cwd: BIOMNI_PATH,
    env,
    stdio: ["pipe", "pipe", "inherit"],
  });

  const transport = new StdioServerTransport({
    reader: child.stdout,
    writer: child.stdin,
  });

  client = new McpClient(transport);
  await client.initialize();
  return client;
}

async function listTools() {
  if (!client) await startMcp();
  const tools = await client.tools.list();
  return tools;
}

async function callTool(toolName, args) {
  if (!client) await startMcp();
  const result = await client.tools.call(toolName, args || {});
  return result;
}

module.exports = { startMcp, listTools, callTool };
```

```javascript
// src/app.js
require("dotenv").config();
const express = require("express");
const { startMcp, listTools, callTool } = require("./biomniMcp");

const app = express();
app.use(express.json());

app.get("/biomni/tools", async (req, res) => {
  try {
    const tools = await listTools();
    res.json(tools);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/biomni/run", async (req, res) => {
  try {
    const { tool, args } = req.body; // 예: { tool: "query_uniprot", args: { prompt: "human insulin" } }
    const out = await callTool(tool, args);
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await startMcp();
  console.log(`Express started on http://localhost:${port}`);
});
```

설명:

- `@modelcontextprotocol/sdk`를 사용하여 stdio 기반 MCP 세션을 초기화합니다.
- `tool_modules`는 Python 런너에서 제한합니다(예: `biomni.tool.database`).
- `/biomni/tools`로 노출된 툴 목록을 확인하고, `/biomni/run`에서 특정 툴을 호출합니다.

---

### 5) 환경 변수(.env) 예시

```ini
# LLM keys (at least one)
ANTHROPIC_API_KEY=YOUR_KEY_HERE
OPENAI_API_KEY=YOUR_KEY_HERE

# Biomni (optional)
BIOMNI_LLM=claude-3-5-sonnet-20241022
BIOMNI_TIMEOUT_SECONDS=1200

# Paths (optional overrides)
BIOMNI_PATH=D:\\Develop\\bot\\Biomni
BIOMNI_PYTHON=D:\\Develop\\bot\\Biomni\.venv\\Scripts\\python.exe
BIOMNI_RUNNER=D:\\Develop\\bot\\Biomni\\run_mcp_server_for_express.py

# External services (used by some tools)
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
NCBI_EMAIL=YOUR_EMAIL@example.com
```

`docs/configuration.md`의 환경 변수 섹션도 참고하세요(LLM/타임아웃/커스텀 모델 등).

---

### 6) 실행 방법

1. PowerShell에서 원클릭 스크립트 실행

```powershell
Set-Location "C:\\path\\to\\your-express-backend"
pwsh -File ".\scripts\setup_biomni_express.ps1" -BiomniPath "D:\\Develop\\bot\\Biomni"
```

2. Express 서버 실행

```powershell
npm run dev
# 또는
npm start
```

3. 테스트

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/biomni/tools

# 예: query_uniprot 호출
$body = @{ tool = "query_uniprot"; args = @{ prompt = "Find information about human insulin" } } | ConvertTo-Json
Invoke-WebRequest -UseBasicParsing -Method POST -Uri http://localhost:3000/biomni/run -Body $body -ContentType "application/json"
```

---

### 7) 문제 해결(Troubleshooting)

- **MCP JS SDK 미설치/버전 문제**: `npm ls @modelcontextprotocol/sdk`로 확인하고 재설치하세요.
- **Python MCP 라이브러리 누락**: venv 활성화 후 `pip install mcp` 재실행.
- **LLM 키 없음**: `.env`에 `ANTHROPIC_API_KEY` 또는 `OPENAI_API_KEY` 설정.
- **Windows 경로 이스케이프**: `.env`에서 `\\` 이스케이프 확인.
- **권한 이슈(winget 등)**: 관리자 PowerShell에서 실행(`Start-Process pwsh -Verb RunAs`).

---

### 8) 운영 팁

- **모듈 스코프 최소화**: `create_mcp_server(tool_modules=[...])`로 필요한 툴만 노출해 보안/성능 최적화.
- **프로세스 관리**: 운영 환경에서는 `pm2`(Node)나 NSSM/Windows 서비스로 MCP 서버/Express를 각각 관리하는 것을 권장.
- **로그/모니터링**: Express 요청/응답 로깅과 MCP 에러 로깅을 분리해 원인 파악을 쉽게 유지.

---

### 9) 참고 링크

- 레포 문서: `docs/mcp_integration.md`, `docs/configuration.md`
- 예제: `tutorials/examples/expose_biomni_server/run_mcp_server.py`

> 이 가이드는 한국어 Windows 개발 환경을 우선으로 하며, PowerShell을 기본으로 제공합니다. Bash 예시는 참고용입니다.
