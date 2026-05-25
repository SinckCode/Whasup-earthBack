// src/routes/favoriteRoutes.ts
import { Router } from 'express';
import {
  addFavorite,
  getFavorites,
  deleteFavorite,
} from '../controllers/favoriteController';
import { authRequired } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authRequired, getFavorites);
router.post('/', authRequired, addFavorite);
router.delete('/:id', authRequired, deleteFavorite);

export default router;
