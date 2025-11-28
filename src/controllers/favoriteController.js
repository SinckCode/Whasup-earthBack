// src/controllers/favoriteController.js
const Favorite = require('../models/Favorite');

// POST /api/favorites
async function addFavorite(req, res) {
  try {
    const user = req.user;
    const {
      eventId,
      title,
      category,
      link,
      coordinates,
      firstDate,
      lastDate,
      note,
    } = req.body;

    if (!eventId || !title || !category) {
      return res
        .status(400)
        .json({ message: 'eventId, title y category son obligatorios.' });
    }

    try {
      const favorite = await Favorite.create({
        userId: user._id,
        eventId,
        title,
        category,
        link,
        coordinates,
        firstDate,
        lastDate,
        note,
      });

      return res.status(201).json(favorite);
    } catch (err) {
      // Si ya existe el favorito (índice único)
      if (err.code === 11000) {
        return res.status(409).json({
          message: 'Este evento ya está en tus favoritos.',
        });
      }
      throw err;
    }
  } catch (err) {
    console.error('💥 Error en addFavorite:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

// GET /api/favorites
async function getFavorites(req, res) {
  try {
    const user = req.user;

    const favorites = await Favorite.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.json(favorites);
  } catch (err) {
    console.error('💥 Error en getFavorites:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

// DELETE /api/favorites/:id
async function deleteFavorite(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;

    const fav = await Favorite.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!fav) {
      return res.status(404).json({ message: 'Favorito no encontrado.' });
    }

    return res.json({ message: 'Favorito eliminado correctamente.' });
  } catch (err) {
    console.error('💥 Error en deleteFavorite:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

module.exports = {
  addFavorite,
  getFavorites,
  deleteFavorite,
};
