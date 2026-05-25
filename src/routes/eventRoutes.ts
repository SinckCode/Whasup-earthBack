import { Router } from 'express';
import { getEvents, getEvent, syncEvents } from '../controllers/eventController';
import { authRequired } from '../middlewares/authMiddleware';
import validate from '../middlewares/validate';
import { queryEventsSchema, syncEventsSchema } from '../schemas/eventSchemas';

const router = Router();

// GET /api/events - Público, sin autenticación
router.get('/', validate(queryEventsSchema), getEvents);

// GET /api/events/:id - Público
router.get('/:id', getEvent);

// POST /api/events/sync/:slug/:year - Solo admin
router.post('/sync/:slug/:year', authRequired, syncEvents);

export default router;
