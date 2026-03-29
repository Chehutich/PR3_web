import express from 'express';
import { getParticipants, createParticipant } from '../controllers/participantController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:eventId', checkAuth, getParticipants);
router.post('/', createParticipant);

export default router;
