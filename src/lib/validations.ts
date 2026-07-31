import { z } from 'zod';

export const censusFormSchema = z.object({
  nombreCompleto: z
    .string()
    .min(3, 'El nombre completo debe tener al menos 3 caracteres')
    .max(120, 'El nombre es demasiado largo'),
  dni: z
    .string()
    .regex(/^\d{8}$/, 'El DNI debe contener exactamente 8 números'),
  edad: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .pipe(
      z
        .number({ invalid_type_error: 'Ingresa una edad válida' })
        .min(1, 'La edad debe ser mayor a 0')
        .max(120, 'Ingresa una edad válida')
    ),
  telefono: z
    .string()
    .min(6, 'El teléfono debe contener al menos 6 dígitos')
    .max(15, 'Teléfono inválido'),
  correo: z
    .string()
    .email('Ingresa un correo electrónico válido'),
  tipoPersona: z.enum(['Miembro', 'Creyente'], {
    required_error: 'Selecciona si eres Miembro o Creyente',
  }),
  direccion: z
    .string()
    .min(5, 'Ingresa tu dirección exacta o búscala en el mapa'),
  referencia: z.string().optional().default(''),
  distrito: z
    .string()
    .min(2, 'Distrito requerido (obtenido mediante la ubicación o ingresado manualmente)'),
  provincia: z
    .string()
    .min(2, 'Provincia requerida'),
  departamento: z
    .string()
    .min(2, 'Departamento requerido'),
  latitud: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .pipe(z.number({ invalid_type_error: 'Latitud inválida' })),
  longitud: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .pipe(z.number({ invalid_type_error: 'Longitud inválida' })),
  consentimiento: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar el consentimiento para el tratamiento de datos pastorales',
    }),
});

export type CensusFormValues = z.infer<typeof censusFormSchema>;
