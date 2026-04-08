import { useState, useEffect } from 'react';

export default function Dashboard({ user, token, onLogout }) {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/lessons', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setLessons(data.lessons);
        const first = data.lessons.find((l) => l.unlocked);
        if (first) setSelected(first);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const registeredDate = new Date(user.registeredAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={layout}>
      {/* Sidebar */}
      <aside style={sidebar}>
        <div style={sidebarHeader}>
          <h1 style={logoText}>Curso por Días</h1>
          <p style={userInfo}>{user.email}</p>
          <p style={regDate}>Desde: {registeredDate}</p>
          <button style={logoutBtn} onClick={onLogout}>Cerrar sesión</button>
        </div>

        {loading && <p style={hint}>Cargando lecciones...</p>}
        {error && <p style={{ ...hint, color: '#dc2626' }}>{error}</p>}

        <ul style={lessonList}>
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              style={lessonItem(lesson.unlocked, selected?.id === lesson.id)}
              onClick={() => lesson.unlocked && setSelected(lesson)}
            >
              <span style={dayBadge(lesson.unlocked)}>Día {lesson.dayNumber}</span>
              <span style={lessonTitle(lesson.unlocked)}>{lesson.title}</span>
              {!lesson.unlocked && <span style={lockIcon}>🔒</span>}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main style={main}>
        {selected ? (
          <div style={contentBox}>
            <p style={dayLabel}>Día {selected.dayNumber}</p>
            <h2 style={videoTitle}>{selected.title}</h2>
            {selected.description && <p style={desc}>{selected.description}</p>}
            <div style={videoWrapper}>
              <iframe
                style={iframe}
                src={selected.videoUrl}
                title={selected.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div style={emptyState}>
            <p style={emptyText}>Selecciona una lección desbloqueada para empezar.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Styles
const layout = { display: 'flex', minHeight: '100vh', background: '#f5f5f5' };
const sidebar = { width: '280px', minWidth: '280px', background: '#fff', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' };
const sidebarHeader = { padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid #eee' };
const logoText = { fontSize: '1.2rem', fontWeight: 700, color: '#4f46e5', marginBottom: '0.5rem' };
const userInfo = { fontSize: '0.85rem', color: '#555', wordBreak: 'break-all' };
const regDate = { fontSize: '0.78rem', color: '#888', marginTop: '0.2rem' };
const logoutBtn = { marginTop: '0.75rem', padding: '0.4rem 0.9rem', background: 'transparent', border: '1px solid #ddd', borderRadius: '6px', color: '#555', fontSize: '0.82rem' };
const lessonList = { listStyle: 'none', padding: '0.5rem 0', overflowY: 'auto', flex: 1 };
const lessonItem = (unlocked, active) => ({
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem',
  cursor: unlocked ? 'pointer' : 'default',
  background: active ? '#eef2ff' : 'transparent',
  borderLeft: active ? '3px solid #4f46e5' : '3px solid transparent',
  opacity: unlocked ? 1 : 0.5,
  transition: 'background 0.15s',
});
const dayBadge = (unlocked) => ({
  fontSize: '0.72rem', fontWeight: 700, background: unlocked ? '#4f46e5' : '#aaa',
  color: '#fff', borderRadius: '4px', padding: '0.15rem 0.4rem', whiteSpace: 'nowrap',
});
const lessonTitle = (unlocked) => ({ fontSize: '0.88rem', color: unlocked ? '#222' : '#999', flex: 1 });
const lockIcon = { fontSize: '0.8rem' };
const hint = { padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#888' };

const main = { flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem' };
const contentBox = { background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '820px', boxShadow: '0 2px 12px #0001' };
const dayLabel = { fontSize: '0.8rem', color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' };
const videoTitle = { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' };
const desc = { color: '#555', marginBottom: '1.5rem', lineHeight: 1.6 };
const videoWrapper = { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', background: '#000' };
const iframe = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' };
const emptyState = { display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 };
const emptyText = { color: '#888', fontSize: '1rem' };
