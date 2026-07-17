#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8765}"
cd "$ROOT"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required. Install Python or use: npx --yes serve . -p $PORT"
  exit 1
fi

echo "Serving W Steak editorial concept at:"
echo "  http://127.0.0.1:$PORT/"
echo "  http://localhost:$PORT/"
echo ""
echo "Press Ctrl+C to stop."
echo "Project folder: $ROOT"

if command -v open >/dev/null 2>&1; then
  open "http://127.0.0.1:$PORT/" 2>/dev/null || true
fi

exec python3 -m http.server "$PORT" --bind 127.0.0.1
