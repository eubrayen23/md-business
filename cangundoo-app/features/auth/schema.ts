import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const signupSchema = loginSchema
  .extend({
    name: z.string().min(2, 'Nome obrigatório'),
    phone: z.string().min(9, 'Telefone inválido'),
    confirmPassword: z.string().min(6, 'Confirmação obrigatória'),
    acceptTerms: z.boolean().refine(val => val, 'Aceite os termos de uso'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
