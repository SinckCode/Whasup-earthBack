import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Notification from '../models/sql/Notification';
import { logActivity } from './activityController';

// GET /api/notifications - Listar notificaciones del usuario (paginado)
async function getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  const { count: total, rows: notifications } = await Notification.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  res.json({
    data: notifications,
    pagination: { total, limit, offset },
  });
}

// GET /api/notifications/unread-count - Contar notificaciones no leídas
async function getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
  const count = await Notification.count({
    where: { userId: req.user.id, isRead: false },
  });

  res.json({ count });
}

// PUT /api/notifications/:id - Marcar como leída
async function markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
  const notification = (await Notification.findByPk(req.params.id as string)) as any;

  if (!notification) {
    return res.status(404).json({ error: 'Notificación no encontrada' });
  }

  if (notification.userId !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  await notification.update({ isRead: true, readAt: new Date() });

  await logActivity(req.user.id, 'mark_notification_read', { notificationId: notification.id }, req.ip);

  res.json(notification);
}

// PUT /api/notifications/read-all - Marcar todas como leídas
async function markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
  const [updated] = await Notification.update(
    { isRead: true, readAt: new Date() },
    { where: { userId: req.user.id, isRead: false } }
  );

  await logActivity(req.user.id, 'mark_all_notifications_read', { updated }, req.ip);

  res.json({ updated });
}

// DELETE /api/notifications/:id - Eliminar notificación
async function deleteNotification(req: AuthRequest, res: Response, next: NextFunction) {
  const notification = (await Notification.findByPk(req.params.id as string)) as any;

  if (!notification) {
    return res.status(404).json({ error: 'Notificación no encontrada' });
  }

  if (notification.userId !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  await notification.destroy();

  await logActivity(req.user.id, 'delete_notification', { notificationId: notification.id }, req.ip);

  res.json({ message: 'Notificación eliminada' });
}

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
