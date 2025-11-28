// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';
const JWT_EXPIRES_IN = '7d';

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { email, password, name, country } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      name,
      country: country || 'MX',
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        country: user.country,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error('Error en register:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        country: user.country,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}

module.exports = {
  register,
  login,
};
