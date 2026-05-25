import { z } from 'zod';

const registerSchema = z.object({
  email: z
    .string('Email es requerido')
    .email('Email no válido'),
  password: z
    .string('Contraseña es requerida')
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener mayúsculas')
    .regex(/[0-9]/, 'Debe contener números'),
  name: z
    .string('Nombre es requerido')
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  country: z
    .string('País es requerido')
    .length(2, 'País debe ser código de 2 letras')
    .optional()
    .default('MX'),
});

const loginSchema = z.object({
  email: z
    .string('Email es requerido')
    .email('Email no válido'),
  password: z
    .string('Contraseña es requerida')
    .min(1, 'Contraseña no puede estar vacía'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export {
  registerSchema,
  loginSchema,
};
