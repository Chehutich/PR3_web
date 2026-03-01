import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { PORT, HOST } from './config.js';

const server = http.createServer(async (req, res) => {
    // Middle: Реалізація логування запитів у консоль
    console.log(`[${new Date().toISOString()}] ${req.method} запит на ${req.url}`);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/events' && req.method === 'GET') {
        try {
            const data = await readFile('./data.json', 'utf-8');
            res.statusCode = 200;
            res.end(data);
        } catch (err) {
            console.error('Помилка читання файлу:', err);
            // Advanced: обробка статус-кодів (500)
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Внутрішня помилка сервера: Не вдалося прочитати дані" }));
        }
    } else {
        // Advanced: обробка статус-кодів (404)
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Маршрут не знайдено. Спробуйте GET /api/events" }));
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Сервер успішно запущено: http://${HOST}:${PORT}`);
    console.log(`Доступні маршрути:`);
    console.log(` - GET http://${HOST}:${PORT}/api/events (список подій)`);
});
