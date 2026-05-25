import jwt from 'jsonwebtoken';
import { User } from '../models/sql';
import { JWT_SECRET } from '../config/constants';
import { Response, NextFunction } from 'express';
import { AuthRequest, JwtPayload } from '../types';

async function authRequired(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findByPk(decoded.id);

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

export { authRequired };
