require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://aashrayam-cmom.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── FIX 3: Static uploads only make sense locally.
//    On Vercel the filesystem is read-only so uploaded files can't be served.
//    We still register the route so it doesn't 404, but local-file uploads
//    should be replaced with Supabase Storage (see README).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/news',         require('./routes/news'));
app.use('/api/events',       require('./routes/events'));
app.use('/api/programs',     require('./routes/programs'));
app.use('/api/gallery',      require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  // FIX 1: Guard against missing DATABASE_URL — returns a clear diagnostic
  // instead of hanging or crashing the function.
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      status: 'ERROR',
      error: 'DATABASE_URL environment variable is not set.',
      hint: 'Add DATABASE_URL in Vercel Dashboard → Settings → Environment Variables'
    });
  }
  try {
    await initDB();
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Aashrayam API v1.0' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ error: 'Internal server error', detail: err.message });
});

// ── FIX 2: On Vercel (serverless) app.listen() must NOT be called.
//    Vercel imports the module and calls the exported app directly.
//    app.listen() in a serverless context either hangs or is silently ignored,
//    but more importantly initDB() failing here would reject the promise and
//    swallow the error — leaving the pool in an unusable state with no log.
//
//    We guard with IS_VERCEL (set automatically by Vercel) so local dev still
//    starts normally with nodemon.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  initDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Failed to initialize DB, server not started:', err.message);
      process.exit(1);
    });
} else {
  // On Vercel: initialise DB lazily on first request via the health route,
  // or let each route's own try/catch surface the connection error clearly.
  console.log('🔧 Running in Vercel serverless mode');
}

// Required for Vercel — this MUST be a top-level synchronous export.
module.exports = app;