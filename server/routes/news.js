const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// FIX 3: Vercel filesystem is READ-ONLY except for /tmp.
// Top-level mkdirSync(__dirname + '/uploads') throws EACCES and crashes the
// entire serverless function at module-load time — before any request is handled.
//
// Solution: Use /tmp for file storage on Vercel (files survive the function
// lifetime only). For persistent storage, migrate uploads to Supabase Storage.
const IS_VERCEL = !!process.env.VERCEL;
const uploadsDir = IS_VERCEL
  ? '/tmp/uploads/news'
  : path.join(__dirname, '../uploads/news');

// Safe mkdir — called lazily, not at module load time
const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

// Helper function to save base64 image and return filename
const saveBase64Image = (base64String) => {
  if (!base64String || typeof base64String !== 'string') return null;

  try {
    // Extract base64 data and file type
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return null;

    const [, fileType, base64Data] = matches;
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const filename = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileType}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file (creates dir on first call — safe on both local and Vercel)
    ensureUploadsDir();
    fs.writeFileSync(filepath, buffer);

    // Return relative path for API access
    return `/uploads/news/${filename}`;
  } catch (err) {
    console.error('Error saving image:', err);
    return null;
  }
};

// GET /api/news — public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM news WHERE published = true ORDER BY created_at DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/news/all — admin
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/news/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/news/upload-image — admin (image upload endpoint)
router.post('/upload-image', authMiddleware, async (req, res) => {
  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    const imagePath = saveBase64Image(imageData);
    if (!imagePath) {
      return res.status(400).json({ error: 'Invalid image data or format' });
    }
    res.json({ imageUrl: imagePath });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// POST /api/news — admin
router.post('/', authMiddleware, async (req, res) => {
  let { title, excerpt, content, category, badge_text, badge_color, image_url, imageData, published } = req.body;

  // Handle image upload if imageData is provided
  if (imageData && !image_url) {
    const savedImagePath = saveBase64Image(imageData);
    if (savedImagePath) {
      image_url = savedImagePath;
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO news(title,excerpt,content,category,badge_text,badge_color,image_url,published)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, excerpt, content, category || 'General', badge_text, badge_color || '#2D7D6F', image_url, published !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/news/:id — admin
router.put('/:id', authMiddleware, async (req, res) => {
  let { title, excerpt, content, category, badge_text, badge_color, image_url, imageData, published } = req.body;

  // Handle image upload if imageData is provided
  if (imageData && imageData !== image_url) {
    const savedImagePath = saveBase64Image(imageData);
    if (savedImagePath) {
      image_url = savedImagePath;
    }
  }

  try {
    const result = await pool.query(
      `UPDATE news SET title=$1,excerpt=$2,content=$3,category=$4,badge_text=$5,
       badge_color=$6,image_url=$7,published=$8,updated_at=NOW() WHERE id=$9 RETURNING *`,
      [title, excerpt, content, category, badge_text, badge_color, image_url, published, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/news/:id — admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Get the news item to find associated image
    const newsResult = await pool.query('SELECT image_url FROM news WHERE id = $1', [req.params.id]);
    const newsItem = newsResult.rows[0];

    // Delete image file if it's a local upload
    if (newsItem && newsItem.image_url && newsItem.image_url.startsWith('/uploads/news/')) {
      const imagePath = path.join(__dirname, '..', newsItem.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete database record
    await pool.query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;