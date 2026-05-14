// src/routes/userRoutes.js
const express = require('express');
const {
  getMe,
  updateMe,
  updatePreferences,
} = require('../controllers/userController');
const { authRequired } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  updateUserSchema,
  updatePreferencesSchema,
} = require('../schemas/userSchemas');

const router = express.Router();

// Todas estas rutas requieren estar logueado
router.get('/me', authRequired, getMe);
router.put('/me', authRequired, validate(updateUserSchema), updateMe);
router.put('/me/preferences', authRequired, validate(updatePreferencesSchema), updatePreferences);

module.exports = router;
