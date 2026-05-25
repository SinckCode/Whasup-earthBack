import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
} from '../controllers/categoryController';
import { authRequired } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/categories - Público
router.get('/', getCategories);

// GET /api/categories/:slug - Público
router.get('/:slug', getCategory);

// POST /api/categories - Solo admin
router.post('/', authRequired, createCategory);

// PUT /api/categories/:slug - Solo admin
router.put('/:slug', authRequired, updateCategory);

export default router;
