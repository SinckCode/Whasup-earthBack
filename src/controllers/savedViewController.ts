// src/controllers/savedViewController.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import SavedView from '../models/mongo/SavedView';
import { logActivity } from './activityController';

// POST /api/saved-views
async function createSavedView(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { name, description, filters, isPublic, tags } = req.body;

    const view = await SavedView.create({
      userId: user.id,
      name,
      description: description || '',
      filters: filters || {},
      isPublic: isPublic || false,
      tags: tags || [],
      viewCount: 0,
    });

    // Log activity
    await logActivity(user.id, 'create_saved_view', { name }, req.ip);

    return res.status(201).json(view);
  } catch (err) {
    next(err);
  }
}

// GET /api/saved-views
async function getSavedViews(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;

    const views = await SavedView.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    return res.json(views);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/saved-views/:id
async function deleteSavedView(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;

    const view = await SavedView.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!view) {
      const err: any = new Error('Vista no encontrada.');
      err.statusCode = 404;
      throw err;
    }

    // Log activity
    await logActivity(user.id, 'delete_saved_view', { viewId: id }, req.ip);

    return res.json({ message: 'Vista eliminada correctamente.' });
  } catch (err) {
    next(err);
  }
}

export {
  createSavedView,
  getSavedViews,
  deleteSavedView,
};
