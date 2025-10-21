#!/usr/bin/env bash
set -euo pipefail

# Change to script directory
cd "$(dirname "$0")"

# Activate venv (create if missing)
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate

# Install deps if needed
pip install --upgrade pip >/dev/null 2>&1 || true
pip install -r requirements.txt

# Load .env (if present) without exporting comments
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# Display minimal env summary (masked)
mask() { local s="$1"; [ -z "$s" ] && echo "NOT SET" || echo "${s:0:8}..."; }
echo "OPENAI_API_KEY: $(mask "${OPENAI_API_KEY:-}")"
echo "LLM_SOURCE: ${LLM_SOURCE:-}"
echo "BIOMNI_LLM: ${BIOMNI_LLM:-}"
echo "PORT: ${PORT:-8000}"

# Start server
python3 main.py
