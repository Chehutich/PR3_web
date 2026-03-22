import { Event } from '../models/Event.js';

export const getEvents = async (req, res) => {
    try {
        let { page, limit, sort, order, cursor } = req.query;

        limit = limit ? parseInt(limit, 10) : 10;
        let query = {};
        
        if (limit < 1) {
            return res.status(400).json({ error: "Параметр 'limit' не може бути менше 1" });
        }

        if (cursor) {
            query = { _id: { $gt: cursor } };
        } else {
            page = page ? parseInt(page, 10) : 1;
            if (page < 1) {
                return res.status(400).json({ error: "Параметр 'page' не може бути менше 1" });
            }
        }

        let sortOptions = {};
        if (sort) {
            let sortOrder = order === 'desc' ? -1 : 1;
            sortOptions[sort] = sortOrder;
        }

        let dbQuery = Event.find(query).sort(sortOptions).limit(limit);

        if (!cursor && page) {
            const skipIndex = (page - 1) * limit;
            dbQuery = dbQuery.skip(skipIndex);
        }

        const events = await dbQuery.exec();

        res.json({
            data: events,
            nextCursor: events.length > 0 ? events[events.length - 1]._id : null
        });

    } catch (err) {
        console.error('Помилка при отриманні подій:', err);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
};

export const deleteEvent = async (req, res) => {
    res.json({ message: 'Ви маєте права адміністратора. Маршрут для видалення події готовий до реалізації логіки.' });
};
