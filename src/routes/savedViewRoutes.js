// src/routes/savedViewRoutes.js
const express = require('express');
const {
  createSavedView,
  getSavedViews,
  deleteSavedView,
} = require('../controllers/savedViewController');
const { authRequired } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authRequired, getSavedViews);
router.post('/', authRequired, createSavedView);
router.delete('/:id', authRequired, deleteSavedView);

module.exports = router;
