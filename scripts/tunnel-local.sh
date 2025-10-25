#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Starting tunnel for local web (3000) and api (4000)"

if command -v ngrok >/dev/null 2>&1 && [ -n "${NGROK_AUTHTOKEN-}" ]; then
  echo "Using ngrok (NGROK_AUTHTOKEN provided). Starting tunnels..."
  # start web tunnel
  ngrok http 3000 &
  echo "ngrok started for http://localhost:3000"
  echo "Run 'ngrok http 4000' to expose API as well."
  exit 0
fi

if command -v cloudflared >/dev/null 2>&1; then
  echo "Using cloudflared. Starting tunnel for web (3000)"
  cloudflared tunnel --url http://localhost:3000
  exit 0
fi

echo "No tunnel client found. Install ngrok or cloudflared and set NGROK_AUTHTOKEN for ngrok."
echo "ngrok example:"
echo "  ngrok authtoken <your-token>"
echo "  ngrok http 3000"
