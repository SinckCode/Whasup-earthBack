import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ActivityLog } from '../models/sql';

// GET /api/activity - Obtener historial de actividad del usuario
async function getActivityLog(req: AuthRequest, res: Response, next: NextFunction) {
  const { limit = 50, offset = 0 } = req.query;

  const [logs, total] = await Promise.all([
    ActivityLog.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      attributes: { exclude: ['ip'] }, // No retornar IP en producción
    }),
    ActivityLog.count({ where: { userId: req.user.id } }),
  ]);

  res.json({
    data: logs,
    pagination: {
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    },
  });
}

/**
 * Función helper para registrar actividad
 * @param {number} userId - ID del usuario
 * @param {string} action - Acción realizada
 * @param {object} meta - Datos adicionales
 * @param {string} ip - IP del cliente
 */
async function logActivity(userId: number, action: string, meta: Record<string, unknown> = {}, ip?: string) {
  try {
    await ActivityLog.create({
      userId,
      action,
      meta,
      ip,
    });
  } catch (err) {
    console.error('Error logging activity:', err);
    // No lanzar error, solo logear
  }
}

export {
  getActivityLog,
  logActivity,
};
