const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'curso.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    registered_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL
  );
`);

// Seed lessons if table is empty
const count = db.prepare('SELECT COUNT(*) as n FROM lessons').get();
if (count.n === 0) {
  const insert = db.prepare(
    'INSERT INTO lessons (day_number, title, description, video_url) VALUES (?, ?, ?, ?)'
  );

  const lessons = [
    [1, 'Bienvenida al curso', 'Introducción y objetivos del curso.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'],
    [2, 'Fundamentos básicos', 'Conceptos esenciales que necesitas saber.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'],
    [3, 'Práctica guiada', 'Ejercicio práctico con ejemplos reales.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'],
    [4, 'Casos de uso', 'Aplicaciones reales del tema.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'],
    [5, 'Proyecto final', 'Construye tu primer proyecto completo.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'],
  ];

  lessons.forEach((l) => insert.run(...l));
  console.log('Lessons seeded successfully.');
}

module.exports = db;
