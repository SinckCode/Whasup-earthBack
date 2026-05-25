import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Category from '../models/mongo/Category';

// GET /api/categories - Listar categorías activas
async function getCategories(req: Request, res: Response, next: NextFunction) {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });

  res.json(categories);
}

// GET /api/categories/:slug - Obtener categoría específica
async function getCategory(req: Request, res: Response, next: NextFunction) {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  res.json(category);
}

// POST /api/categories - Crear categoría (admin)
async function createCategory(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo admins pueden crear categorías' });
  }

  const category = new Category(req.body);
  await category.save();

  res.status(201).json(category);
}

// PUT /api/categories/:slug - Actualizar categoría (admin)
async function updateCategory(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo admins pueden actualizar categorías' });
  }

  const category = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true }
  );

  if (!category) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  res.json(category);
}

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
};
