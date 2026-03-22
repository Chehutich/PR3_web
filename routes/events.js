import express from 'express';
import { getEvents, deleteEvent } from '../controllers/eventController.js';
import { checkAuth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEvents);
router.delete('/:eventId', checkAuth, checkRole(['Admin']), deleteEvent);

export default router;
