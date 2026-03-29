import React from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Event Management System</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Повноцінна Full-stack платформа для керування подіями, аналітики та онлайн підтримки.
      </p>

      {user ? (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/events" className="btn">Переглянути події</Link>
          <Link to="/analytics" className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--primary)' }}>Аналітика</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div className="card" style={{ maxWidth: '500px' }}>
            <h3>Вітаємо!</h3>
            <p style={{ marginTop: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Для повноцінного доступу до системи, створення подій та участі в онлайн-чаті підтримки, будь ласка, авторизуйтесь.
            </p>
            <Link to="/auth" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Увійти в систему</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
