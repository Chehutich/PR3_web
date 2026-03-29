import { Participant } from '../models/Participant.js';

export const getParticipants = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const participants = await Participant.find({ eventId: eventId });
        res.json(participants);
    } catch (err) {
        console.error('Помилка при отриманні учасників:', err);
        res.status(500).json({ error: 'Некоректний ID події або внутрішня помилка' });
    }
};

export const createParticipant = async (req, res) => {
    try {
        const { eventId, name, email } = req.body;
        
        if (!eventId || !name || !email) {
            return res.status(400).json({ error: 'Будь ласка, вкажіть eventId, ім\'я та email' });
        }

        const newParticipant = new Participant({ eventId, name, email });
        await newParticipant.save();
        res.status(201).json(newParticipant);
    } catch (err) {
        console.error('Помилка при створенні учасника:', err);
        res.status(500).json({ error: 'Помилка при реєстрації учасника' });
    }
};
