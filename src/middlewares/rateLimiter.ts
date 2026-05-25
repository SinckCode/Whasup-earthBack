import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Rate limiter para rutas de autenticacion (mas estricto)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requests por ventana
  message: 'Demasiados intentos de autenticación, intenta más tarde',
  standardHeaders: true, // Retorna RateLimit-* headers
  legacyHeaders: false,
  skip: (req: Request) => process.env.NODE_ENV === 'development',
});

// Rate limiter general para API (menos estricto)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 requests por minuto
  message: 'Demasiadas peticiones, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => process.env.NODE_ENV === 'development',
});

export {
  authLimiter,
  apiLimiter,
};
