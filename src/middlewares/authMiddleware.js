// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';

async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    req.user = user; // lo tendrás disponible en controladores
    next();
  } catch (err) {
    console.error('Error en authRequired:', err);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = { authRequired };
