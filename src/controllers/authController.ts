// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserPreference } from '../models/sql';
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } from '../config/constants';
import { logActivity } from './activityController';

function createToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
async function register(req: Request, res: Response, next: NextFunction) {
  try {
    // Data is already validated by validate middleware
    const { email, password, name, country } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      const err: any = new Error('El email ya está registrado.');
      err.code = 'DUPLICATE_ERROR';
      err.statusCode = 409;
      throw err;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      name: name.trim(),
      country,
    }) as any;

    // Create default preferences
    await UserPreference.create({
      userId: user.id,
      theme: 'light',
      defaultView: 'map',
      defaultTimeRange: '7d',
    });

    // Log activity
    await logActivity(user.id, 'register', { email }, req.ip);

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        country: user.country,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // Data is already validated by validate middleware
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ where: { email: normalizedEmail } }) as any;
    if (!user) {
      const err: any = new Error('Credenciales inválidas.');
      err.code = 'AUTH_ERROR';
      err.statusCode = 401;
      throw err;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err: any = new Error('Credenciales inválidas.');
      err.code = 'AUTH_ERROR';
      err.statusCode = 401;
      throw err;
    }

    // Update lastLoginAt
    await user.update({ lastLoginAt: new Date() });

    // Log activity
    await logActivity(user.id, 'login', {}, req.ip);

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        country: user.country,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export {
  register,
  login,
};
