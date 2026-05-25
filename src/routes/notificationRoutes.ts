import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
