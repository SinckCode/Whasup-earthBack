// src/routes/userRoutes.ts
import { Router } from 'express';
import {
  getMe,
  updateMe,
  updatePreferences,
} from '../controllers/userController';
import { authRequired } from '../middlewares/authMiddleware';
import validate from '../middlewares/validate';
import {
  updateUserSchema,
  updatePreferencesSchema,
} from '../schemas/userSchemas';

const router = Router();

// Todas estas rutas requieren estar logueado
router.get('/me', authRequired, getMe);
router.put('/me', authRequired, validate(updateUserSchema), updateMe);
router.put('/me/preferences', authRequired, validate(updatePreferencesSchema), updatePreferences);

export default router;
