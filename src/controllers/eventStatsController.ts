import { Request, Response, NextFunction } from 'express';
import EventStats from '../models/mongo/EventStats';

// GET /api/event-stats/:eventId - Obtener estadísticas de un evento (público)
async function getEventStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;

    const stats = await EventStats.findOne({ eventId });

    if (!stats) {
      return res.json({
        eventId,
        viewCount: 0,
        favoriteCount: 0,
        commentCount: 0,
      });
    }

    return res.json(stats);
  } catch (err) {
    next(err);
  }
}

// POST /api/event-stats/:eventId/view - Registrar una vista (público)
async function recordView(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;

    const stats = await EventStats.findOneAndUpdate(
      { eventId },
      {
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date() },
      },
      { upsert: true, new: true }
    );

    return res.json(stats);
  } catch (err) {
    next(err);
  }
}

/**
 * Helper para incrementar una estadística de un evento
 * @param eventId - ID del evento
 * @param field - Campo a incrementar (viewCount, favoriteCount, commentCount)
 * @param amount - Cantidad a incrementar (puede ser negativo)
 */
async function incrementStat(eventId: string, field: string, amount: number) {
  await EventStats.findOneAndUpdate(
    { eventId },
    { $inc: { [field]: amount } },
    { upsert: true, new: true }
  );
}

export {
  getEventStats,
  recordView,
  incrementStat,
};
