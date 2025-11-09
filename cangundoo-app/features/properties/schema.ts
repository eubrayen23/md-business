import { z } from 'zod';

export const propertyFormSchema = z.object({
  title: z.string().min(6, 'Título muito curto'),
  description: z.string().optional(),
  price_kz: z.coerce.number().min(1000, 'Preço inválido'),
  location: z.string().min(2, 'Localização obrigatória'),
  city: z.string().min(2, 'Cidade obrigatória'),
  property_type: z.enum(['casa', 'apartamento', 'terreno', 'outro']),
  bedrooms: z.coerce.number().nonnegative(),
  bathrooms: z.coerce.number().nonnegative(),
  area_m2: z.coerce.number().nonnegative(),
  status: z.enum(['draft', 'published']).default('published'),
  generateDescription: z.boolean().default(true),
  images: z.array(z.string()).min(1, 'Envie ao menos uma imagem'),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
