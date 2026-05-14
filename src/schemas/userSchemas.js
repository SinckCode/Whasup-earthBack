const { z } = require('zod');

const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo')
    .optional(),
  country: z
    .string()
    .length(2, 'País debe ser código de 2 letras')
    .optional(),
});

const updatePreferencesSchema = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  defaultCategory: z.string().optional(),
  defaultView: z.enum(['map', 'timeline', 'stats']).optional(),
  defaultTimeRange: z.string().optional(),
});

module.exports = {
  updateUserSchema,
  updatePreferencesSchema,
};
