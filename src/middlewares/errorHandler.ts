import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

/**
 * Error handler middleware global
 * Normaliza errores y retorna respuestas consistentes
 */
const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', {
    message: err.message,
    code: err.code,
    status: err.status || err.statusCode,
    path: req.path,
    method: req.method,
  });

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validación de base de datos fallida',
      code: 'VALIDATION_ERROR',
      details: (err as any).errors.map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Recurso duplicado',
      code: 'DUPLICATE_ERROR',
      details: (err as any).errors.map((e: any) => e.path),
    });
  }

  // MongoDB Cast Error (ObjectId inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      code: 'CAST_ERROR',
      details: { field: (err as any).path, value: (err as any).value },
    });
  }

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validación de base de datos fallida',
      code: 'VALIDATION_ERROR',
      details: Object.keys((err as any).errors).reduce((acc: Record<string, string>, key: string) => {
        acc[key] = (err as any).errors[key].message;
        return acc;
      }, {}),
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === '11000' || (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    return res.status(409).json({
      error: 'Recurso duplicado',
      code: 'DUPLICATE_ERROR',
      details: { field },
    });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      code: 'JWT_ERROR',
    });
  }

  // JWT Expired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      code: 'TOKEN_EXPIRED',
      expiredAt: (err as any).expiredAt,
    });
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
