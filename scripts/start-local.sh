#!/usr/bin/env bash
set -euo pipefail

# start-local.sh
# Convenience script to start the full local dev stack:
# - copies example env files if missing
# - starts docker infra (Postgres + Redis)
# - installs dependencies (pnpm)
# - starts dev servers detached and writes logs/pid

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
LOGFILE="/tmp/polyglot-dev.log"
PIDFILE="/tmp/polyglot-dev.pid"

echo "[start-local] repo root: $ROOT_DIR"

cd "$ROOT_DIR"

echo "[start-local] ensuring env files exist..."
[ -f app/.env ] || cp app/.env.example app/.env || true
[ -f proxy/.env ] || cp proxy/.env.example proxy/.env || true

echo "[start-local] bringing up docker services (Postgres + Redis)..."
docker compose up -d

echo "[start-local] installing dependencies (pnpm install)..."
pnpm install

if [ -f "$PIDFILE" ]; then
  if kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    echo "[start-local] dev servers already running with PID $(cat "$PIDFILE"). Use 'kill \\$(cat $PIDFILE)' to stop."
    exit 0
  else
    echo "[start-local] stale PID file found, removing..."
    rm -f "$PIDFILE"
  fi
fi

echo "[start-local] starting dev servers detached (logs -> $LOGFILE)"
nohup pnpm -r --parallel dev > "$LOGFILE" 2>&1 & echo $! > "$PIDFILE"

sleep 1
echo "[start-local] waiting a moment for services to start..."
sleep 2

echo "[start-local] dev servers started."
echo "  Web: http://localhost:3000"
echo "  API: http://localhost:4000"
echo "  Proxy WS: ws://localhost:4100/ws/asr"
echo "Logs: $LOGFILE"
echo "PID: $(cat "$PIDFILE")"

echo "[start-local] tailing last 20 lines of log (press Ctrl-C to stop tail):"
tail -n 20 -f "$LOGFILE" || true
