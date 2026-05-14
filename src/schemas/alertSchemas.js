const { z } = require('zod');

const createAlertSchema = z.object({
  categorySlug: z
    .string('Categoría es requerida')
    .min(1, 'Categoría no puede estar vacía'),
  regions: z.array(z.string()).optional().default([]),
  countries: z.array(z.string()).optional().default([]),
  severityMin: z
    .number()
    .min(0, 'Severidad no puede ser negativa')
    .optional()
    .default(0),
  isActive: z.boolean().optional().default(true),
  notifyByEmail: z.boolean().optional().default(false),
});

const updateAlertSchema = z.object({
  categorySlug: z.string().optional(),
  regions: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  severityMin: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  notifyByEmail: z.boolean().optional(),
});

module.exports = {
  createAlertSchema,
  updateAlertSchema,
};
