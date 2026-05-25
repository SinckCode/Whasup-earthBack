import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Comment from '../models/mongo/Comment';
import EventStats from '../models/mongo/EventStats';
import { logActivity } from './activityController';

// GET /api/comments?eventId=xxx - Obtener comentarios de un evento (público)
async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: 'eventId es requerido' });
    }

    const topLevelComments = await Comment.find({
      eventId: eventId as string,
      parentId: null,
    }).sort({ createdAt: -1 });

    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await Comment.find({
          parentId: comment._id as any,
        }).sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    return res.json({ data: commentsWithReplies });
  } catch (err) {
    next(err);
  }
}

// POST /api/comments - Crear un comentario
async function createComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { eventId, content, parentId } = req.body;

    // Si tiene parentId, verificar que el padre existe y es top-level
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        const err: any = new Error('Comentario padre no encontrado.');
        err.statusCode = 404;
        throw err;
      }
      if (parentComment.parentId !== null) {
        const err: any = new Error('Solo se puede responder a comentarios de primer nivel.');
        err.statusCode = 400;
        throw err;
      }
    }

    const comment = await Comment.create({
      userId: user.id,
      userName: user.name,
      eventId,
      content,
      parentId: parentId || null,
    });

    // Incrementar commentCount en EventStats
    await EventStats.findOneAndUpdate(
      { eventId },
      { $inc: { commentCount: 1 } },
      { upsert: true, new: true }
    );

    // Log activity
    await logActivity(user.id, 'create_comment', { eventId, commentId: comment._id }, req.ip);

    return res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

// PUT /api/comments/:id - Editar un comentario
async function updateComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      const err: any = new Error('Comentario no encontrado.');
      err.statusCode = 404;
      throw err;
    }

    if (comment.userId !== user.id) {
      const err: any = new Error('No tienes permiso para editar este comentario.');
      err.statusCode = 403;
      throw err;
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    return res.json(comment);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/comments/:id - Eliminar un comentario
async function deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      const err: any = new Error('Comentario no encontrado.');
      err.statusCode = 404;
      throw err;
    }

    if (comment.userId !== user.id) {
      const err: any = new Error('No tienes permiso para eliminar este comentario.');
      err.statusCode = 403;
      throw err;
    }

    let deletedCount = 1;

    // Si es un comentario padre, eliminar también las respuestas
    if (comment.parentId === null) {
      const replies = await Comment.countDocuments({ parentId: comment._id as any });
      deletedCount += replies;
      await Comment.deleteMany({ parentId: comment._id as any });
    }

    await comment.deleteOne();

    // Decrementar commentCount en EventStats
    await EventStats.findOneAndUpdate(
      { eventId: comment.eventId },
      { $inc: { commentCount: -deletedCount } },
      { upsert: true, new: true }
    );

    // Log activity
    await logActivity(user.id, 'delete_comment', { commentId: id, eventId: comment.eventId }, req.ip);

    return res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    next(err);
  }
}

export {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
