import { supabase } from '@services/api/supabaseClient';
import { SignupFormValues, LoginFormValues } from './schema';

export const signIn = async ({ email, password }: LoginFormValues) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUp = async ({ email, password, name, phone }: SignupFormValues) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
      },
    },
  });

  if (error) throw error;

  return data;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://cangundoo.app/reset-password',
  });

  if (error) throw error;
};
