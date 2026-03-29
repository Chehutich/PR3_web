import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = { email, password, role: 'User' };
      
      const response = await api.post(endpoint, payload);
      
      if (isLogin) {
        // Зберігаємо юзера локально (сесія на бекенді вже записалась в cookie)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate('/events');
      } else {
        alert('Реєстрація успішна! Тепер увійдіть.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Сталася помилка');
    }
  };

  return (
    <div className="auth-container card">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isLogin ? 'Вхід в систему' : 'Реєстрація'}
      </h2>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email адреса</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="name@example.com"
          />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
        {isLogin ? 'Немає акаунту? ' : 'Вже зареєстровані? '}
        <span 
          style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Створити зараз' : 'Увійти'}
        </span>
      </p>
    </div>
  );
}

export default Auth;
