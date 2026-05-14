const express = require('express');
const { getActivityLog } = require('../controllers/activityController');
const { authRequired } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/activity - Solo usuario autenticado
router.use(authRequired);
router.get('/', getActivityLog);

module.exports = router;
