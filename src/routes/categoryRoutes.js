const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
} = require('../controllers/categoryController');
const { authRequired } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/categories - Público
router.get('/', getCategories);

// GET /api/categories/:slug - Público
router.get('/:slug', getCategory);

// POST /api/categories - Solo admin
router.post('/', authRequired, createCategory);

// PUT /api/categories/:slug - Solo admin
router.put('/:slug', authRequired, updateCategory);

module.exports = router;
