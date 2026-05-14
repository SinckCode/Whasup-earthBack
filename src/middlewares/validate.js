/**
 * Middleware para validar request body con Zod
 * @param {ZodSchema} schema - Schema Zod para validar
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({
      error: 'Validación fallida',
      code: 'VALIDATION_ERROR',
      details: errors,
    });
  }

  req.body = result.data;
  next();
};

module.exports = validate;
