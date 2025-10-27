import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import pkg from 'pg';
import { WebSocket } from 'ws';

const { Pool } = pkg;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Bootstrap DB table
async function bootstrapDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS attempts (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      exercise_id UUID NOT NULL,
      correct BOOLEAN NOT NULL,
      latency_ms INTEGER NOT NULL,
      details JSONB,
      ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

// --- ROUTES ---

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Unified API status endpoint for frontend
app.get('/api/status', async (req, res) => {
  const proxyHost = process.env.PROXY_HOST || 'localhost';
  const proxyPort = parseInt(process.env.PROXY_PORT || '4100', 10);

  const status = { api: true, database: false, proxy: false };

  // Check DB
  try {
    await pool.query('SELECT 1');
    status.database = true;
  } catch {
    status.database = false;
  }

  // Check Proxy
  try {
    const wsUrl = `ws://${proxyHost}:${proxyPort}/ws/asr`;
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl, { handshakeTimeout: 1500 });
      const timer = setTimeout(() => {
        ws.terminate();
        reject(new Error('timeout'));
      }, 1600);
      ws.once('open', () => {
        ws.send(JSON.stringify({ type: 'start' }));
      });
      ws.once('message', () => {
        clearTimeout(timer);
        ws.terminate();
        status.proxy = true;
        resolve();
      });
      ws.once('error', () => {
        clearTimeout(timer);
        ws.terminate();
        reject();
      });
    });
  } catch {
    status.proxy = false;
  }

  res.json(status);
});

// Optional favicon to silence 404 spam
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Simple dev auth
app.use((req, res, next) => {
  const uid =
    req.header('x-user-id') ||
    '00000000-0000-0000-0000-000000000001';
  req.user = { id: uid };
  next();
});

// Idempotent upsert for lesson attempts
app.post('/attempts', async (req, res) => {
  const { id, exerciseId, correct, latencyMs, details } = req.body || {};
  if (!exerciseId || typeof correct !== 'boolean') {
    return res.status(400).json({ error: 'invalid body' });
  }

  const attemptId = id || randomUUID();

  try {
    await pool.query(
      `
      INSERT INTO attempts(id, user_id, exercise_id, correct, latency_ms, details)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id)
      DO UPDATE SET correct = EXCLUDED.correct,
                    latency_ms = EXCLUDED.latency_ms,
                    details = EXCLUDED.details;
    `,
      [attemptId, req.user.id, exerciseId, correct, latencyMs || 0, details || {}]
    );

    const { rows } = await pool.query('SELECT * FROM attempts WHERE id=$1', [
      attemptId,
    ]);
    res.json(rows[0]);
  } catch (e) {
    console.error('DB Error:', e.message);
    res.status(500).json({ error: 'server_error' });
  }
});

// Start server
app.listen(PORT, async () => {
  await bootstrapDb();
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
