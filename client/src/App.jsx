import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import Auth from './pages/Auth.jsx';
import Analytics from './pages/Analytics.jsx';
import Support from './pages/Support.jsx';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Проста імітація перевірки сесії (для спрощення)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <h2>EventSystem</h2>
        <div className="nav-links">
          <Link to="/">Головна</Link>
          <Link to="/events">Події</Link>
          <Link to="/analytics">Аналітика</Link>
          <Link to="/support">Підтримка</Link>
          {user ? (
            <button className="btn" style={{ padding: '0.4rem 1rem', background: '#ef4444' }} onClick={handleLogout}>
              Вийти ({user.email})
            </button>
          ) : (
            <Link to="/auth" className="btn" style={{ textDecoration: 'none' }}>Увійти</Link>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/events" element={<Events user={user} />} />
          <Route path="/auth" element={<Auth setUser={setUser} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/support" element={<Support user={user} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
