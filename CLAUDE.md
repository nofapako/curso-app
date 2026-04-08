# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Curso por Días" — a day-gated video course app. Users register, and each lesson unlocks one per day based on their registration date. Day 1 is available immediately; Day N unlocks after N-1 full days have elapsed since registration (UTC).

## Commands

### Backend (`backend/`)
```bash
cd backend
cp .env.example .env   # first time only — set JWT_SECRET
npm install
npm run dev            # nodemon, auto-reloads on change
npm start              # production
```

### Frontend (`frontend/`)
```bash
cd frontend
npm install
npm run dev            # Vite dev server on http://localhost:3000
npm run build          # production build → dist/
```

The Vite dev server proxies `/api/*` to `http://localhost:3001`, so both servers must run simultaneously during development.

## Architecture

### Unlock logic
`backend/routes/lessons.js` computes unlock status: `unlockedUpToDay = floor((now - registeredAt) / 86400000) + 1`. The `registered_at` column in SQLite is stored as UTC without a timezone suffix; a `'Z'` is appended in JS before constructing the `Date` to ensure correct UTC parsing.

### Auth flow
- Register/login → JWT (7-day expiry) returned in response body
- Frontend stores token in `localStorage` and sends it as `Authorization: Bearer <token>`
- `backend/middleware/auth.js` verifies the JWT and attaches `req.user = { id, email }`

### Database
`better-sqlite3` (synchronous). The DB file is `backend/curso.db` (auto-created on first run). Schema and lesson seed data are applied in `backend/db.js` at startup using `CREATE TABLE IF NOT EXISTS` and a row-count guard.

### Frontend state
No external state library. Auth state (`token`, `user`) lives in `App.jsx` and is persisted to `localStorage`. Lesson data is fetched once in `Dashboard.jsx` on mount.

## Adding new lessons

Insert a row into the `lessons` table (or add it to the seed array in `backend/db.js` before the DB file is created):

```sql
INSERT INTO lessons (day_number, title, description, video_url)
VALUES (6, 'Nuevo tema', 'Descripción breve.', 'https://www.youtube.com/embed/VIDEO_ID');
```

To use a YouTube video, convert the watch URL to an embed URL:
- Watch: `https://www.youtube.com/watch?v=VIDEO_ID`
- Embed: `https://www.youtube.com/embed/VIDEO_ID`

## Environment variables

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signs/verifies JWTs — must be a long random string in production |
| `PORT` | Backend port (default `3001`) |
