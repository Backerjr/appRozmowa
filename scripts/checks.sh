#!/usr/bin/env bash
set -euo pipefail

echo "1) Scanning for git conflict markers (excluding node_modules)..."
if grep -R --line-number --exclude-dir=node_modules '^<<<<<<< ' . >/dev/null 2>&1; then
  echo "ERROR: Found git merge conflict markers in repository. Run 'git status' and resolve conflicts first." >&2
  grep -R --line-number --exclude-dir=node_modules '^<<<<<<< ' || true
  exit 2
fi
echo "No conflict markers found."

echo "2) Validating package.json files parse as JSON..."
node -e "const fs=require('fs'); const files=['package.json','app/package.json','web/package.json','proxy/package.json']; let ok=true; files.forEach(f=>{ try{ JSON.parse(fs.readFileSync(f,'utf8')); console.log(f+' ok'); }catch(e){ console.error(f+' ERR: '+e.message); ok=false; }}); if(!ok) process.exit(3);"

echo "All checks passed."
