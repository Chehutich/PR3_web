import express from 'express';
import { PORT, HOST } from './config.js';

const app = express();

const events = [
    {
        "id": 1,
        "title": "abc",
        "description": "description test 1",
        "date": "2026-04-15T19:00:00Z",
        "organizer": "organizer test 1"
    },
    {
        "id": 2,
        "title": "def",
        "description": "description test 2",
        "date": "2026-05-10T10:00:00Z",
        "organizer": "organizer test 2"
    },
    {
        "id": 3,
        "title": "ghi",
        "description": "description test 3",
        "date": "2026-06-20T15:00:00Z",
        "organizer": "organizer test 3"
    }
];

// Для логування часу запиту
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} запит на ${req.url}`);
    next();
});

// GET 
app.get('/events', (req, res) => {
    let result = [...events];
    let { page, limit, sort, order } = req.query;

    // Можливість сортування даних за датою або назвою
    if (sort) {
        let sortOrder = order === 'desc' ? -1 : 1;
        result.sort((a, b) => {
            if (a[sort] < b[sort]) return -1 * sortOrder;
            if (a[sort] > b[sort]) return 1 * sortOrder;
            return 0;
        });
    }

    // Default пагінація або якщо вказані параметри
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;

    // Валідація Query-параметрів (page не може бути менше 1)
    if (page < 1) {
        return res.status(400).json({ error: "Параметр 'page' не може бути менше 1" });
    }
    if (limit < 1) {
        return res.status(400).json({ error: "Параметр 'limit' не може бути менше 1" });
    }

    // Реалізація пагінації для фіктивних даних
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResult = result.slice(startIndex, endIndex);

    res.json(paginatedResult);
});

// Обробка неіснуючих маршрутів
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не знайдено. Спробуйте GET /events" });
});

app.listen(PORT, HOST, () => {
    console.log(`Сервер Express успішно запущено: http://${HOST}:${PORT}`);
    console.log(`Доступні маршрути: GET http://${HOST}:${PORT}/events`);
});
