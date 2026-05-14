// src/controllers/userController.js
const { User, UserPreference } = require('../models/sql');
const { logActivity } = require('./activityController');

// GET /api/users/me
async function getMe(req, res, next) {
  try {
    const user = req.user; // viene del authMiddleware

    // Fetch preferences
    const preferences = await UserPreference.findOne({
      where: { userId: user.id },
    });

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      country: user.country,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      preferences: preferences || {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/me (actualizar nombre / país)
async function updateMe(req, res, next) {
  try {
    const user = req.user;
    const { name, country } = req.body;

    // Update user fields
    const updates = {};
    if (name) updates.name = name.trim();
    if (country) updates.country = country;

    await user.update(updates);

    // Log activity
    await logActivity(user.id, 'update_profile', updates, req.ip);

    // Fetch preferences
    const preferences = await UserPreference.findOne({
      where: { userId: user.id },
    });

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      country: user.country,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      preferences: preferences || {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/me/preferences (tema, categoría por defecto, etc.)
async function updatePreferences(req, res, next) {
  try {
    const user = req.user;
    const { theme, defaultCategory, defaultView, defaultTimeRange } = req.body;

    // Find or create preferences
    let preferences = await UserPreference.findOne({
      where: { userId: user.id },
    });

    if (!preferences) {
      preferences = await UserPreference.create({
        userId: user.id,
        theme: theme || 'light',
        defaultCategory: defaultCategory || null,
        defaultView: defaultView || 'map',
        defaultTimeRange: defaultTimeRange || '7d',
      });
    } else {
      const updates = {};
      if (theme !== undefined) updates.theme = theme;
      if (defaultCategory !== undefined) updates.defaultCategory = defaultCategory;
      if (defaultView !== undefined) updates.defaultView = defaultView;
      if (defaultTimeRange !== undefined) updates.defaultTimeRange = defaultTimeRange;

      await preferences.update(updates);
    }

    // Log activity
    await logActivity(user.id, 'update_preferences', req.body, req.ip);

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      country: user.country,
      role: user.role,
      preferences: preferences.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMe,
  updateMe,
  updatePreferences,
};
