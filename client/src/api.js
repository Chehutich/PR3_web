import axios from 'axios';

// Налаштування базового URL для всіх запитів до нашого бекенду
const api = axios.create({
    baseURL: 'http://localhost:3000',
    // Обов'язково для роботи express-session (передаватиме кукі між портами)
    withCredentials: true 
});

export default api;
