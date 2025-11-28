// src/controllers/userController.js
const User = require('../models/User');

// GET /api/users/me
async function getMe(req, res) {
  const user = req.user; // viene del authMiddleware

  return res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    country: user.country,
    role: user.role,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

// PUT /api/users/me  (actualizar nombre / país)
async function updateMe(req, res) {
  try {
    const user = req.user;
    const { name, country } = req.body;

    if (!name && !country) {
      return res.status(400).json({ message: 'Nada que actualizar.' });
    }

    if (name) user.name = name.trim();
    if (country) user.country = country;

    await user.save();

    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      country: user.country,
      role: user.role,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error('💥 Error en updateMe:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

// PUT /api/users/me/preferences  (tema, categoría por defecto, etc.)
async function updatePreferences(req, res) {
  try {
    const user = req.user;
    const { theme, defaultCategory, defaultView, defaultTimeRange } = req.body;

    if (!user.preferences) user.preferences = {};

    if (theme) user.preferences.theme = theme;
    if (defaultCategory) user.preferences.defaultCategory = defaultCategory;
    if (defaultView) user.preferences.defaultView = defaultView;
    if (defaultTimeRange) user.preferences.defaultTimeRange = defaultTimeRange;

    await user.save();

    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      country: user.country,
      role: user.role,
      preferences: user.preferences,
    });
  } catch (err) {
    console.error('💥 Error en updatePreferences:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

module.exports = {
  getMe,
  updateMe,
  updatePreferences,
};
