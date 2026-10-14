// server/db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;

let rawConn =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (rawConn && rawConn.includes('?')) {
  rawConn = rawConn.split('?')[0];
}

export const pool = new Pool({
  connectionString: rawConn,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000
});

// CRITICAL: Prevent pool errors from crashing the server process
pool.on('error', (err) => {
  console.error('⚠️ Supabase pool idle connection dropped (auto-recovered):', err.message);
});

// Safe parameterized query wrapper (protects against SQL Injection)
export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && duration > 500) {
      console.log(`Executed query in ${duration}ms: ${text.slice(0, 60)}...`);
    }
    return res;
  } catch (err) {
    console.error('Database query error:', err.message);
    throw err;
  }
}
