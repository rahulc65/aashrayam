const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM programs WHERE published = true ORDER BY sort_order ASC, created_at ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, duration, icon, color, features, normal_fee, addon_fee, addon_courses, seats, tags, published, sort_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO programs(title,description,duration,icon,color,features,normal_fee,addon_fee,addon_courses,seats,tags,published,sort_order)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [title, description, duration, icon, color || '#2D7D6F', features || [], normal_fee || null, addon_fee || null, addon_courses || [], seats || null, tags || [], published !== false, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, duration, icon, color, features, normal_fee, addon_fee, addon_courses, seats, tags, published, sort_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE programs SET title=$1,description=$2,duration=$3,icon=$4,color=$5,
       features=$6,normal_fee=$7,addon_fee=$8,addon_courses=$9,seats=$10,tags=$11,published=$12,sort_order=$13,updated_at=NOW() WHERE id=$14 RETURNING *`,
      [title, description, duration, icon, color, features, normal_fee, addon_fee, addon_courses, seats, tags, published, sort_order, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM programs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
