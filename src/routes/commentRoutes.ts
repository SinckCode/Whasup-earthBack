import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware';
import validate from '../middlewares/validate';
import { createCommentSchema, updateCommentSchema } from '../schemas/commentSchemas';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController';

const router = Router();

router.get('/', getComments);
router.post('/', authRequired, validate(createCommentSchema), createComment);
router.put('/:id', authRequired, validate(updateCommentSchema), updateComment);
router.delete('/:id', authRequired, deleteComment);

export default router;
