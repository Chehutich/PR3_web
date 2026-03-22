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
