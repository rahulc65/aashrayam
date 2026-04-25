const { Pool } = require('pg');

// ── FIX 1 (Primary Root Cause): DATABASE_URL is undefined on Vercel ──────────
//
// Locally: `dotenv` loads server/.env which has DATABASE_URL set.
// On Vercel: .env is NOT deployed (it's in .gitignore). If DATABASE_URL is not
// added manually in Vercel Dashboard → Settings → Environment Variables, it is
// UNDEFINED at runtime. The Pool constructor accepts undefined silently, but
// pool.connect() then throws "getaddrinfo ENOTFOUND undefined" or
// "password authentication failed" — causing every route to return 500.
//
// Fix: Validate at startup and throw a clear, actionable error immediately.
if (!process.env.DATABASE_URL) {
  console.error('❌ FATAL: DATABASE_URL is not set.');
  console.error('   → Local: check server/.env file exists and has DATABASE_URL');
  console.error('   → Vercel: add DATABASE_URL in Dashboard → Settings → Environment Variables');
  // Don't process.exit here — let routes return a helpful 500 rather than crashing
  // the module entirely (which would give Vercel a 502 with no body).
}

// ── FIX 2: Pool configuration for Vercel serverless ──────────────────────────
//
// Your DATABASE_URL uses Supabase's connection POOLER (port 6543, pgbouncer=true).
// This is the correct URL for serverless — do NOT switch to port 5432 (direct).
//
// Key settings for serverless:
//   max: 1        — each serverless function gets exactly 1 connection.
//                   More than 1 causes "too many clients" errors on free Supabase.
//   idleTimeoutMillis: 0   — don't close idle connections (function may be reused).
//   connectionTimeoutMillis: 10000 — fail fast rather than hanging Vercel function.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000,
});

// Surface connection errors immediately rather than silently swallowing them
pool.on('error', (err) => {
  console.error('❌ Unexpected DB pool error:', err.message);
});

const initDB = async () => {
  // Guard — if DATABASE_URL is missing, give a clear error instead of hanging
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Cannot connect to database.');
  }

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS members (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(255) NOT NULL,
        email         VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role          VARCHAR(50)  DEFAULT 'admin',
        created_at    TIMESTAMP    DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS news (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(500) NOT NULL,
        excerpt     TEXT,
        content     TEXT,
        category    VARCHAR(100) DEFAULT 'General',
        badge_text  VARCHAR(100),
        badge_color VARCHAR(50)  DEFAULT '#2D7D6F',
        image_url   TEXT,
        published   BOOLEAN      DEFAULT true,
        created_at  TIMESTAMP    DEFAULT NOW(),
        updated_at  TIMESTAMP    DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS events (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(500) NOT NULL,
        description TEXT,
        event_date  DATE         NOT NULL,
        event_time  VARCHAR(50),
        location    VARCHAR(255),
        image_url   TEXT,
        category    VARCHAR(100),
        is_featured BOOLEAN      DEFAULT false,
        published   BOOLEAN      DEFAULT true,
        created_at  TIMESTAMP    DEFAULT NOW(),
        updated_at  TIMESTAMP    DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS programs (
        id            SERIAL PRIMARY KEY,
        title         VARCHAR(255) NOT NULL,
        description   TEXT,
        duration      VARCHAR(100),
        icon          VARCHAR(100),
        color         VARCHAR(50)  DEFAULT '#2D7D6F',
        features      TEXT[]       DEFAULT '{}',
        normal_fee    VARCHAR(100),
        addon_fee     VARCHAR(100),
        addon_courses TEXT[]       DEFAULT '{}',
        seats         INTEGER,
        tags          TEXT[]       DEFAULT '{}',
        published     BOOLEAN      DEFAULT true,
        sort_order    INTEGER      DEFAULT 0,
        created_at    TIMESTAMP    DEFAULT NOW(),
        updated_at    TIMESTAMP    DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id         SERIAL PRIMARY KEY,
        title      VARCHAR(255),
        image_url  TEXT         NOT NULL,
        category   VARCHAR(100) DEFAULT 'Campus Life',
        published  BOOLEAN      DEFAULT true,
        sort_order INTEGER      DEFAULT 0,
        created_at TIMESTAMP    DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        role       VARCHAR(255),
        content    TEXT         NOT NULL,
        rating     INTEGER      DEFAULT 5,
        avatar_url TEXT,
        published  BOOLEAN      DEFAULT true,
        created_at TIMESTAMP    DEFAULT NOW(),
        updated_at TIMESTAMP    DEFAULT NOW()
      );
    `);

    // Migrations: add columns that may be missing on existing databases
    const migrations = [
      `ALTER TABLE programs ADD COLUMN IF NOT EXISTS normal_fee    VARCHAR(100)`,
      `ALTER TABLE programs ADD COLUMN IF NOT EXISTS addon_fee     VARCHAR(100)`,
      `ALTER TABLE programs ADD COLUMN IF NOT EXISTS addon_courses TEXT[] DEFAULT '{}'`,
      `ALTER TABLE programs ADD COLUMN IF NOT EXISTS seats         INTEGER`,
      `ALTER TABLE programs ADD COLUMN IF NOT EXISTS tags          TEXT[] DEFAULT '{}'`,
    ];
    for (const sql of migrations) {
      await client.query(sql);
    }

    console.log('✅ Database schema initialized');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    throw err; // Re-throw so callers know it failed
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };