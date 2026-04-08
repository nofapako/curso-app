const router = require('express').Router();
const auth = require('../middleware/auth');
const pool = require('../db');

router.get('/', auth, async (req, res) => {
  try {
    const { rows: user } = await pool.query('SELECT created_at FROM users WHERE id = $1', [req.user.id]);
    const createdAt = new Date(user[0].created_at);
    const now = new Date();
    const daysSince = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    const { rows: lessons } = await pool.query('SELECT * FROM lessons ORDER BY day_number');
    const result = lessons.map(l => ({
      ...l,
      unlocked: l.day_number <= daysSince + 1
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
