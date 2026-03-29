import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function Support({ user }) {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Система', text: 'Вітаємо в чаті підтримки! Напишіть своє питання.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Advanced: Підключення Socket.IO клієнта до нашого бекенду на порту 3000
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      console.log('Підключено до чату Socket.IO');
    });

    // Слухаємо вхідні повідомлення
    socketRef.current.on('support_message', (msg) => {
      setMessages((prev) => [...prev, { ...msg, id: Date.now() }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Автоскрол вниз
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const messageData = {
      user: user ? user.email.split('@')[0] : 'Гість',
      text: inputVal
    };

    // Відправляємо подію на бекенд
    socketRef.current.emit('support_message', messageData);
    setInputVal('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Онлайн Чат Підтримки (Socket.io)</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Задайте питання нашим адміністраторам. Повідомлення оновлюються в реальному часі без перезавантаження сторінки (Advanced рівень).
      </p>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="message"
              style={{
                alignSelf: msg.user === (user ? user.email.split('@')[0] : 'Гість') ? 'flex-end' : 'flex-start',
                background: msg.user === 'Система' ? 'rgba(16, 185, 129, 0.2)' : 
                           msg.user === (user ? user.email.split('@')[0] : 'Гість') ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <p>
                <strong style={{ color: msg.user === (user ? user.email.split('@')[0] : 'Гість') ? 'rgba(255,255,255,0.8)' : 'var(--accent)'}}>
                  {msg.user}
                </strong> 
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input" onSubmit={sendMessage}>
          <input 
            type="text" 
            placeholder="Введіть повідомлення..." 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="btn">Надіслати</button>
        </form>
      </div>
    </div>
  );
}

export default Support;
