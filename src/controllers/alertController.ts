import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Alert } from '../models/sql';

// POST /api/alerts - Crear alerta
async function createAlert(req: AuthRequest, res: Response, next: NextFunction) {
  const alert = await Alert.create({
    userId: req.user.id,
    ...req.body,
  });

  res.status(201).json(alert);
}

// GET /api/alerts - Listar alertas del usuario
async function getAlerts(req: AuthRequest, res: Response, next: NextFunction) {
  const alerts = await Alert.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });

  res.json(alerts);
}

// GET /api/alerts/:id - Obtener alerta específica
async function getAlert(req: AuthRequest, res: Response, next: NextFunction) {
  const alert = await Alert.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!alert) {
    return res.status(404).json({ error: 'Alerta no encontrada' });
  }

  res.json(alert);
}

// PUT /api/alerts/:id - Actualizar alerta
async function updateAlert(req: AuthRequest, res: Response, next: NextFunction) {
  const alert = await Alert.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!alert) {
    return res.status(404).json({ error: 'Alerta no encontrada' });
  }

  await alert.update(req.body);
  res.json(alert);
}

// DELETE /api/alerts/:id - Eliminar alerta
async function deleteAlert(req: AuthRequest, res: Response, next: NextFunction) {
  const result = await Alert.destroy({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (result === 0) {
    return res.status(404).json({ error: 'Alerta no encontrada' });
  }

  res.json({ message: 'Alerta eliminada correctamente' });
}

export {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
};
