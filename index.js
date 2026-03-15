import express from 'express';
import { PORT, HOST } from './config.js';
import connectDB from './db.js';
import { Event } from './models/Event.js';
import { Participant } from './models/Participant.js';

const app = express();

// Підключення до БД при старті сервера
connectDB();

// Для логування часу запиту
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} запит на ${req.url}`);
    next();
});

// GET /events
app.get('/events', async (req, res) => {
    try {
        let { page, limit, sort, order, cursor } = req.query;

        // Default параметри
        limit = limit ? parseInt(limit, 10) : 10;
        let query = {};

        // Advanced: Валідація
        if (limit < 1) {
            return res.status(400).json({ error: "Параметр 'limit' не може бути менше 1" });
        }

        // Advanced: Cursor-based пагінація
        if (cursor) {
            query = { _id: { $gt: cursor } };
        } else {
            // Звичайна пагінація (якщо немає курсора)
            page = page ? parseInt(page, 10) : 1;
            if (page < 1) {
                return res.status(400).json({ error: "Параметр 'page' не може бути менше 1" });
            }
        }

        // Налаштування сортування
        let sortOptions = {};
        if (sort) {
            let sortOrder = order === 'desc' ? -1 : 1;
            sortOptions[sort] = sortOrder;
        }

        // Формування запиту до MongoDB з пагінацією та сортуванням
        let dbQuery = Event.find(query).sort(sortOptions).limit(limit);

        // Якщо використовується сторінкова пагінація (не курсор), додаємо skip
        if (!cursor && page) {
            const skipIndex = (page - 1) * limit;
            dbQuery = dbQuery.skip(skipIndex);
        }

        const events = await dbQuery.exec();

        // Повертаємо дані, а також ID останнього елемента для наступної сторінки (якщо є)
        res.json({
            data: events,
            nextCursor: events.length > 0 ? events[events.length - 1]._id : null
        });

    } catch (err) {
        console.error('Помилка при отриманні подій:', err);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});

// GET /participants/:eventId
app.get('/participants/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;

        // Отримуємо учасників конкретної події
        const participants = await Participant.find({ eventId: eventId });

        res.json(participants);
    } catch (err) {
        console.error('Помилка при отриманні учасників:', err);
        res.status(500).json({ error: 'Некоректний ID події або внутрішня помилка' });
    }
});

// Обробка неіснуючих маршрутів
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не знайдено." });
});

app.listen(PORT, HOST, () => {
    console.log(`Сервер Express успішно запущено: http://${HOST}:${PORT}`);
    console.log(`Доступні маршрути: GET http://${HOST}:${PORT}/events`);
});
