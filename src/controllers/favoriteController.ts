// src/controllers/favoriteController.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Favorite from '../models/mongo/Favorite';
import { logActivity } from './activityController';

// POST /api/favorites
async function addFavorite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const {
      eventId,
      title,
      category,
      link,
      coordinates,
      firstDate,
      lastDate,
      note,
      severity,
      magnitude,
    } = req.body;

    const favorite = await Favorite.create({
      userId: user.id,
      eventId,
      title,
      category,
      link,
      coordinates,
      firstDate,
      lastDate,
      note,
      severity,
      magnitude,
    });

    // Log activity
    await logActivity(user.id, 'create_favorite', { eventId, category }, req.ip);

    return res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
}

// GET /api/favorites
async function getFavorites(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;

    const favorites = await Favorite.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    return res.json(favorites);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/favorites/:id
async function deleteFavorite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;

    const fav = await Favorite.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!fav) {
      const err: any = new Error('Favorito no encontrado.');
      err.statusCode = 404;
      throw err;
    }

    // Log activity
    await logActivity(user.id, 'delete_favorite', { favoriteId: id }, req.ip);

    return res.json({ message: 'Favorito eliminado correctamente.' });
  } catch (err) {
    next(err);
  }
}

export {
  addFavorite,
  getFavorites,
  deleteFavorite,
};
