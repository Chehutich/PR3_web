import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', checkAuth, createEvent);
router.put('/:id', checkAuth, updateEvent);
router.delete('/:id', checkAuth, deleteEvent);

export default router;
