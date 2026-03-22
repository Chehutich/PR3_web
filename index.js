import express from 'express';
import session from 'express-session';
import { PORT, HOST } from './config.js';
import connectDB from './db.js';

// Імпорт маршрутів
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import participantRoutes from './routes/participants.js';

const app = express();

// Підключення до БД при старті сервера
connectDB();

// Middleware для читання JSON
app.use(express.json());

// Налаштування сесій
app.use(session({
    secret: 'my_super_secret_key_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // повинно бути true для HTTPS, але для localhost false
        maxAge: 1000 * 60 * 60 * 24 // 1 день
    }
}));

// Для логування часу запиту
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} запит на ${req.url}`);
    next();
});

// =====================
// ПІДКЛЮЧЕННЯ МАРШРУТІВ
// =====================
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/participants', participantRoutes);

// Обробка неіснуючих маршрутів
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не знайдено." });
});

app.listen(PORT, HOST, () => {
    console.log(`Сервер Express успішно запущено: http://${HOST}:${PORT}`);
    console.log(`Доступні базові маршрути:`);
    console.log(` - POST /auth/register`);
    console.log(` - POST /auth/login`);
    console.log(` - GET /events`);
    console.log(` - GET /participants/:eventId`);
});
