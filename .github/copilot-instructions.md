## Purpose

This file gives AI coding agents the minimal, high-signal context needed to be productive in this polyglot-starter repo: how the monorepo is laid out, the primary dev flow, important conventions, and concrete examples (ASR messages, API payloads, file pointers).

## Quick facts

- Monorepo managed with pnpm workspaces. Root `package.json` lists `api`, `web`, `proxy`.
- Dev entry: `pnpm -r --parallel dev` (runs each package's `dev` script).
- Local infra: `docker compose up -d` starts Postgres + Redis (see `docker-compose.yml`).
- Copy env examples before running services: `cp api/.env.example api/.env` and `cp proxy/.env.example proxy/.env`.

## High-level architecture

- web/ — front-end demo (React, lightweight, not Next in this starter). Key files: `web/src/main.jsx`, `web/src/pages/Lesson.jsx`, `web/src/shared/ExercisePlayer.jsx`, `web/src/shared/useAsr.js`.
- api/ (in this repo under `app/`) — minimal Express API that bootstraps a Postgres table and exposes `/attempts` and `/health`. See `app/src/main.js` for DB bootstrapping and request behavior.
- proxy/ — WebSocket-based ASR proxy (stubbed). Accepts small control messages and emits `partial`/`final` transcript messages so the UI can be developed without cloud ASR credentials. See `proxy/src/index.js`.

Why this structure: the proxy is intentionally stubbed to allow offline UI work; the API uses a simple header-based dev auth so front-end dev can call endpoints without complex auth setup.

## Project-specific conventions & patterns

- Dev auth: API trusts the `x-user-id` header. If missing, it defaults to a deterministic UUID in `app/src/main.js`. When implementing auth changes, update this file and tests that rely on the header.
- DB bootstrap: the API creates the `attempts` table at startup (idempotent SQL). Migrations are not present — edits to schema require manual SQL or adding a migration step.
- ASR flow: front-end uses a tiny `useAsr(url)` hook. The hook opens a WebSocket and sends control objects (not raw audio) in this starter: `{"type":"start"}` and `{"type":"stop"}`.

## Concrete message + endpoint shapes (copy these examples)

- ASR WebSocket messages (proxy <-> web)
  - Start from client: { "type": "start" }
  - Stop from client: { "type": "stop" }
  - Partial transcript from proxy: { "type": "partial", "text": "th..." }
  - Final transcript from proxy: { "type": "final", "text": "three" }
  - Example files: `web/src/shared/useAsr.js`, `proxy/src/index.js`.

- API `/attempts` (POST) body (see `app/src/main.js`):
  - Required: { exerciseId: string, correct: boolean }
  - Optional: { id?: string, latencyMs?: number, details?: object }
  - Dev auth: send `x-user-id` header (string UUID). If omitted, API will use a default dev UUID.

## Key files to inspect when modifying behavior

- `web/src/shared/useAsr.js` — the ASR client hook. Useful when swapping the stub proxy for real speech streaming.
- `proxy/src/index.js` — stubbed ASR server; replace or extend this to integrate Azure Speech. It expects the start/stop control messages and emits JSON partial/final messages.
- `app/src/main.js` — minimal Express API: DB Pool, table bootstrap, `/attempts` endpoint and lightweight dev auth.
- `web/src/shared/ExercisePlayer.jsx` & `web/src/pages/Lesson.jsx` — examples of exercise types supported by the UI: `mcq`, `tap_order`, `listen_type`. Use these when adding new exercise types or telemetry.
- `docker-compose.yml` — starts `postgres:15-alpine` and `redis:7-alpine` for local development. DB connection string comes from env (see `app/.env.example`).
- `scripts/install-vendored-tsconfig.cjs` and `vendor/@ljharb/tsconfig` — repo vendors a tsconfig package; keep postinstall logic if adding tooling that depends on it.

## Debugging & run tips

- To run everything locally (recommended):

```bash
pnpm install
cp app/.env.example app/.env
cp proxy/.env.example proxy/.env
docker compose up -d
pnpm -r dev
```

- Service URLs by default:
  - Web: http://localhost:3000
  - API: http://localhost:4000
  - Proxy (WS): ws://localhost:4100/ws/asr

- When testing ASR UX, the proxy emits a sequence of `partial` messages then a `final`. If you wire a real ASR service, keep the same message contract so front-end code requires minimal changes.

## Common small tasks agents are asked to do (and where to start)

- Add a new exercise type UI: modify `Lesson.jsx` to include sample data and implement rendering/logic in `ExercisePlayer.jsx`.
- Replace stubbed ASR with real service: edit `proxy/src/index.js` to connect to Azure Speech, but preserve the `{type:'partial'|'final', text}` messages to avoid front-end changes.
- Add server-side validation for `/attempts`: see `app/src/main.js` for the current minimal checks and expand them to your required schema.

## What not to assume

- The proxy is a testing stub — don't assume audio streaming is implemented. The `useAsr` hook does not capture or stream mic audio in this starter; it only sends control messages.
- The repo is intentionally minimal; there is no migration tooling. Schema changes may require manual SQL or adding a migration framework.

## If something's unclear

- Ask for the intended runtime behavior (for example: should the ASR send timestamps or word-level confidences?). Provide the desired message shape and update both `proxy/src/index.js` and `web/src/shared/useAsr.js` together.

---
Files referenced above are the single best place to start; when in doubt, open `README.md` at the repo root for quickstart notes.
