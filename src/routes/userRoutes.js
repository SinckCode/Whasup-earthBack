// src/routes/userRoutes.js
const express = require('express');
const {
  getMe,
  updateMe,
  updatePreferences,
} = require('../controllers/userController');
const { authRequired } = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas estas rutas requieren estar logueado
router.get('/me', authRequired, getMe);
router.put('/me', authRequired, updateMe);
router.put('/me/preferences', authRequired, updatePreferences);

module.exports = router;
