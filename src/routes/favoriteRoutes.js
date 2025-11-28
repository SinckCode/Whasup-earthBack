// src/routes/favoriteRoutes.js
const express = require('express');
const {
  addFavorite,
  getFavorites,
  deleteFavorite,
} = require('../controllers/favoriteController');
const { authRequired } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authRequired, getFavorites);
router.post('/', authRequired, addFavorite);
router.delete('/:id', authRequired, deleteFavorite);

module.exports = router;
