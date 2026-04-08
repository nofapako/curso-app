const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway.internal') ? false : { rejectUnauthorized: false }
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id SERIAL PRIMARY KEY,
      day_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      video_url TEXT
    )
  `);
  const { rows } = await pool.query('SELECT COUNT(*) FROM lessons');
  if (parseInt(rows[0].count) === 0) {
    const lessons = [
      [1, 'Corte radical', 'Día 1', 'https://www.youtube.com/embed/R6M7mLvbQj4'],
      [2, 'Entorno', 'Día 2', 'https://www.youtube.com/embed/fC2naTjhMsA'],
      [3, 'Protocolo', 'Día 3', 'https://www.youtube.com/embed/1Q5Ohx8WT8c'],
      [4, 'Vital Behavior', 'Día 4', 'https://www.youtube.com/embed/6A33EaYQYmA'],
      [5, 'Neuroplasticidad', 'Día 5', 'https://www.youtube.com/embed/qVY_9iTSqH0'],
      [6, 'Consolidación', 'Día 6', 'https://www.youtube.com/embed/2Cj7NNKm_Vg'],
      [7, 'Extremo', 'Día 7', 'https://www.youtube.com/embed/br5b4HTET_I'],
      [9, 'Hola', 'Día 9', 'https://www.youtube.com/embed/6yL4H8V3VA0'],
    ];
    for (const [day, title, desc, url] of lessons) {
      await pool.query('INSERT INTO lessons (day_number, title, description, video_url) VALUES ($1, $2, $3, $4)', [day, title, desc, url]);
    }
  }
  console.log('DB ready');
}

init().catch(console.error);

module.exports = pool;
