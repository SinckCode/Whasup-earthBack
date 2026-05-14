const express = require('express');
const { getEvents, getEvent, syncEvents } = require('../controllers/eventController');
const { authRequired } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { queryEventsSchema, syncEventsSchema } = require('../schemas/eventSchemas');

const router = express.Router();

// GET /api/events - Público, sin autenticación
router.get('/', validate(queryEventsSchema), getEvents);

// GET /api/events/:id - Público
router.get('/:id', getEvent);

// POST /api/events/sync/:slug/:year - Solo admin
router.post('/sync/:slug/:year', authRequired, syncEvents);

module.exports = router;
