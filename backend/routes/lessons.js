const router = require('express').Router();
const db = require('../db');
const requireAuth = require('../middleware/auth');

// Returns all lessons with unlock status based on registration date.
// A lesson for day N unlocks when (now - registeredAt) >= (N - 1) full days.
// Day 1 is available immediately on registration day.
router.get('/', requireAuth, (req, res) => {
  const user = db
    .prepare('SELECT registered_at FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const registeredAt = new Date(user.registered_at + 'Z'); // treat as UTC
  const now = new Date();
  const msSinceRegistration = now - registeredAt;
  const daysSinceRegistration = Math.floor(msSinceRegistration / (1000 * 60 * 60 * 24));
  // Day 1 unlocks on day 0 (same day), day 2 on day 1, etc.
  const unlockedUpToDay = daysSinceRegistration + 1;

  const lessons = db.prepare('SELECT * FROM lessons ORDER BY day_number ASC').all();

  const result = lessons.map((lesson) => ({
    id: lesson.id,
    dayNumber: lesson.day_number,
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.day_number <= unlockedUpToDay ? lesson.video_url : null,
    unlocked: lesson.day_number <= unlockedUpToDay,
  }));

  res.json({ lessons: result, unlockedUpToDay });
});

module.exports = router;
