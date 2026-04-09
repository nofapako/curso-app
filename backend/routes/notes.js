const router = require('express').Router();
const auth = require('../middleware/auth');
const pool = require('../db');

router.get('/:day', auth, async (req, res) => {
  const day = parseInt(req.params.day);
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 AND day_number = $2',
      [req.user.id, day]
    );
    res.json(rows[0] || { content: '' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:day', auth, async (req, res) => {
  const day = parseInt(req.params.day);
  const { content } = req.body;
  try {
    const existing = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 AND day_number = $2',
      [req.user.id, day]
    );
    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        'UPDATE notes SET content = $1, updated_at = NOW() WHERE user_id = $2 AND day_number = $3 RETURNING *',
        [content, req.user.id, day]
      );
    } else {
      result = await pool.query(
        'INSERT INTO notes (user_id, day_number, content) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, day, content]
      );
    }
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
