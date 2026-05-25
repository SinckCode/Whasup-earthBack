// src/routes/savedViewRoutes.ts
import { Router } from 'express';
import {
  createSavedView,
  getSavedViews,
  deleteSavedView,
} from '../controllers/savedViewController';
import { authRequired } from '../middlewares/authMiddleware';

const router = Router();

// Todas requieren auth
router.get('/', authRequired, getSavedViews);
router.post('/', authRequired, createSavedView);
router.delete('/:id', authRequired, deleteSavedView);

export default router;
