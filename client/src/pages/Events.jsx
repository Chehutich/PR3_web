import React, { useState, useEffect } from 'react';
import api from '../api';

function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events?limit=20');
      // Оскільки ми повертали { data: events, nextCursor: ... }
      setEvents(response.data.data || response.data);
    } catch (err) {
      console.error('Помилка при завантаженні подій', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити подію?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.error || 'Помилка видалення');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Каталог Подій</h2>
        {user && <button className="btn">Створити подію</button>}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>Завантаження подій...</p>
      ) : (
        <div className="grid-events">
          {events.length === 0 ? (
            <p>Немає доступних подій.</p>
          ) : (
            events.map(event => (
              <div key={event._id} className="card">
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{event.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  {event.description || 'Немає опису для цієї події.'}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Організатор: {event.organizer}</span>
                  {user && (user.role === 'Admin' || user.id === event.creator) && (
                    <button 
                      onClick={() => handleDelete(event._id)}
                      style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Видалити
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Events;
