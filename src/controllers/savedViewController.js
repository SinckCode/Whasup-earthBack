// src/controllers/savedViewController.js
const SavedView = require('../models/SavedView');

// POST /api/saved-views
async function createSavedView(req, res) {
  try {
    const user = req.user;
    const { name, description, filters } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    const view = await SavedView.create({
      userId: user._id,
      name,
      description: description || '',
      filters: filters || {},
    });

    return res.status(201).json(view);
  } catch (err) {
    console.error('💥 Error en createSavedView:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

// GET /api/saved-views
async function getSavedViews(req, res) {
  try {
    const user = req.user;

    const views = await SavedView.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.json(views);
  } catch (err) {
    console.error('💥 Error en getSavedViews:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

// DELETE /api/saved-views/:id
async function deleteSavedView(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;

    const view = await SavedView.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!view) {
      return res.status(404).json({ message: 'Vista no encontrada.' });
    }

    return res.json({ message: 'Vista eliminada correctamente.' });
  } catch (err) {
    console.error('💥 Error en deleteSavedView:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

module.exports = {
  createSavedView,
  getSavedViews,
  deleteSavedView,
};
