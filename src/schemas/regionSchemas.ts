import { z } from 'zod';

const createRegionSchema = z.object({
  name: z
    .string('Nombre es requerido')
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  minLat: z
    .number('minLat debe ser número')
    .min(-90, 'Latitud debe estar entre -90 y 90')
    .max(90, 'Latitud debe estar entre -90 y 90'),
  maxLat: z
    .number('maxLat debe ser número')
    .min(-90, 'Latitud debe estar entre -90 y 90')
    .max(90, 'Latitud debe estar entre -90 y 90'),
  minLon: z
    .number('minLon debe ser número')
    .min(-180, 'Longitud debe estar entre -180 y 180')
    .max(180, 'Longitud debe estar entre -180 y 180'),
  maxLon: z
    .number('maxLon debe ser número')
    .min(-180, 'Longitud debe estar entre -180 y 180')
    .max(180, 'Longitud debe estar entre -180 y 180'),
  isDefault: z.boolean().optional().default(false),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color debe ser hex válido')
    .optional()
    .default('#3B82F6'),
});

const updateRegionSchema = createRegionSchema.partial();

export type CreateRegionInput = z.infer<typeof createRegionSchema>;
export type UpdateRegionInput = z.infer<typeof updateRegionSchema>;

export {
  createRegionSchema,
  updateRegionSchema,
};
