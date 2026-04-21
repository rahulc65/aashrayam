const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Ensure gallery uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for gallery uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gallery WHERE published = true ORDER BY sort_order ASC, created_at DESC LIMIT 12'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// File upload endpoint
router.post('/upload-image', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }
  res.json({
    filename: req.file.filename,
    path: `/uploads/gallery/${req.file.filename}`
  });
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, image_url, file_path, category, published, sort_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO gallery(title,image_url,file_path,category,published,sort_order)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, image_url || null, file_path || null, category || 'Campus Life', published !== false, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, image_url, file_path, category, published, sort_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE gallery SET title=$1,image_url=$2,file_path=$3,category=$4,published=$5,sort_order=$6 WHERE id=$7 RETURNING *`,
      [title, image_url || null, file_path || null, category, published, sort_order, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Get the file path before deleting
    const result = await pool.query('SELECT file_path FROM gallery WHERE id = $1', [req.params.id]);
    if (result.rows[0] && result.rows[0].file_path) {
      const filePath = path.join(uploadsDir, result.rows[0].file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await pool.query('DELETE FROM gallery WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
