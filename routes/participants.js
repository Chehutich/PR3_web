import express from 'express';
import { getParticipants } from '../controllers/participantController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:eventId', checkAuth, getParticipants);

export default router;
