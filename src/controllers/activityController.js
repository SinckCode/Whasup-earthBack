const { ActivityLog } = require('../models/sql');

// GET /api/activity - Obtener historial de actividad del usuario
async function getActivityLog(req, res, next) {
  const { limit = 50, offset = 0 } = req.query;

  const [logs, total] = await Promise.all([
    ActivityLog.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['ip'] }, // No retornar IP en producción
    }),
    ActivityLog.count({ where: { userId: req.user.id } }),
  ]);

  res.json({
    data: logs,
    pagination: {
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
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
async function logActivity(userId, action, meta = {}, ip = null) {
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

module.exports = {
  getActivityLog,
  logActivity,
};
