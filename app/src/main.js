
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Minimal tables bootstrap (idempotent)
async function bootstrapDb(){
  await pool.query(`
    create table if not exists attempts(
      id uuid primary key,
      user_id uuid not null,
      exercise_id uuid not null,
      correct boolean not null,
      latency_ms integer not null,
      details jsonb,
      ts timestamptz not null default now()
    );
  `);
}

app.get('/health', (req,res)=> res.json({ ok:true }));

// Dev auth: email/password-less (header based for simplicity)
app.use((req,res,next)=>{
  const uid = req.header('x-user-id') || '00000000-0000-0000-0000-000000000001';
  req.user = { id: uid };
  next();
});

// Idempotent upsert attempt
app.post('/attempts', async (req,res)=>{
  const { id, exerciseId, correct, latencyMs, details } = req.body || {};
  if(!exerciseId || typeof correct!=='boolean') return res.status(400).json({ error: 'invalid body' });
  const attemptId = id || randomUUID();
  try{
    await pool.query(`
      insert into attempts(id, user_id, exercise_id, correct, latency_ms, details)
      values ($1, $2, $3, $4, $5, $6)
      on conflict (id) do update set correct=excluded.correct, latency_ms=excluded.latency_ms, details=excluded.details;
    `,[attemptId, req.user.id, exerciseId, correct, latencyMs||0, details||{}]);
    const { rows } = await pool.query('select * from attempts where id=$1',[attemptId]);
    res.json(rows[0]);
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

app.listen(PORT, async ()=>{
  await bootstrapDb();
  console.log(`API listening on http://localhost:${PORT}`);
});
