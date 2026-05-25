import { Router } from 'express';
import { getActivityLog } from '../controllers/activityController';
import { authRequired } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/activity - Solo usuario autenticado
router.use(authRequired);
router.get('/', getActivityLog);

export default router;
