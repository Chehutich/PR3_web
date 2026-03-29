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

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, organizer } = req.body;
        const newEvent = new Event({
            title,
            description,
            date,
            organizer,
            creator: req.session.user.id
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error('Помилка при створенні події:', err);
        res.status(500).json({ error: 'Помилка при створенні події' });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        
        if (!event) return res.status(404).json({ error: 'Подію не знайдено' });

        // Перевірка прав (тільки творець або Admin)
        if (event.creator && event.creator.toString() !== req.session.user.id && req.session.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Ви можете редагувати лише власні події' });
        }

        Object.assign(event, req.body);
        await event.save();
        res.json(event);
    } catch (err) {
        console.error('Помилка при оновленні події:', err);
        res.status(500).json({ error: 'Помилка при оновленні події' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        
        if (!event) return res.status(404).json({ error: 'Подію не знайдено' });

        if (event.creator && event.creator.toString() !== req.session.user.id && req.session.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Ви можете видаляти лише власні події (або необхідні права Адміністратора)' });
        }

        await Event.findByIdAndDelete(eventId);
        res.json({ message: 'Подію успішно видалено' });
    } catch (err) {
        console.error('Помилка при видаленні події:', err);
        res.status(500).json({ error: 'Помилка при видаленні події' });
    }
};
