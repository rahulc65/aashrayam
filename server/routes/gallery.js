const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// FIX 3: Same as news.js — top-level mkdirSync crashes Vercel at module load.
// Use /tmp on Vercel; local path otherwise.
const IS_VERCEL = !!process.env.VERCEL;
const uploadsDir = IS_VERCEL
  ? '/tmp/uploads/gallery'
  : path.join(__dirname, '../uploads/gallery');

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

// Configure multer for gallery uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// ── FIX 1: multer error handler passed to upload so multer errors
//    reach the route and return a 400 instead of an unhandled crash (500).
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.'));
    }
  }
});

// Wrap multer so we can return a JSON error instead of letting it crash
const uploadSingle = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// ── GET public gallery
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gallery WHERE published = true ORDER BY sort_order ASC, created_at DESC LIMIT 12'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Gallery GET error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

// ── GET all (admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Gallery GET /all error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

// ── FIX 2: File upload endpoint now uses the safe uploadSingle wrapper
router.post('/upload-image', authMiddleware, uploadSingle, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided. Send the image as multipart/form-data with field name "file".' });
  }
  res.json({
    filename: req.file.filename,
    path: `/uploads/gallery/${req.file.filename}`
  });
});

// ── POST create gallery entry
// ── FIX 3: The DB schema (initDB) only has "image_url TEXT NOT NULL" —
//    there is NO "file_path" column. The route was inserting file_path
//    which caused a "column file_path does not exist" error → 500.
//    Solution: store the uploaded path in image_url, drop file_path everywhere.
router.post('/', authMiddleware, async (req, res) => {
  const { title, image_url, file_path, category, published, sort_order } = req.body;

  // Accept either image_url or file_path (legacy field sent by frontend)
  const resolvedImageUrl = image_url || file_path || null;

  if (!title || !resolvedImageUrl) {
    return res.status(400).json({ error: 'Title and an image (image_url or file_path) are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO gallery(title, image_url, category, published, sort_order)
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [title, resolvedImageUrl, category || 'Campus Life', published !== false, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Gallery POST error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

// ── PUT update gallery entry
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, image_url, file_path, category, published, sort_order } = req.body;
  const resolvedImageUrl = image_url || file_path || null;

  if (!title || !resolvedImageUrl) {
    return res.status(400).json({ error: 'Title and an image (image_url or file_path) are required.' });
  }

  try {
    const result = await pool.query(
      `UPDATE gallery
       SET title=$1, image_url=$2, category=$3, published=$4, sort_order=$5
       WHERE id=$6 RETURNING *`,
      [title, resolvedImageUrl, category, published, sort_order, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Gallery PUT error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

// ── DELETE gallery entry (also removes disk file when it was a local upload)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT image_url FROM gallery WHERE id = $1', [req.params.id]);
    if (result.rows[0] && result.rows[0].image_url) {
      const stored = result.rows[0].image_url;
      // Only attempt deletion for local uploads (paths starting with /uploads/)
      if (stored.startsWith('/uploads/gallery/')) {
        const filename = path.basename(stored);
        const filePath = path.join(uploadsDir, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
    await pool.query('DELETE FROM gallery WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Gallery DELETE error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

module.exports = router;