const router = require('express').Router();
const auth = require('../middleware/auth');
const pool = require('../db');

router.post('/:day', auth, async (req, res) => {
  const day = parseInt(req.params.day);
  try {
    const existing = await pool.query(
      'SELECT * FROM checkins WHERE user_id = $1 AND day_number = $2',
      [req.user.id, day]
    );
    if (existing.rows.length > 0) {
      return res.json({ checkin: existing.rows[0] });
    }
    const { rows } = await pool.query(
      'INSERT INTO checkins (user_id, day_number) VALUES ($1, $2) RETURNING *',
      [req.user.id, day]
    );
    res.json({ checkin: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM checkins WHERE user_id = $1 ORDER BY day_number',
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
