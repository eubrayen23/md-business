const requiredEnv = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'DEEPSEEK_API_URL',
  'DEEPSEEK_API_KEY',
];

export const getEnv = () => {
  const env = {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    appEnv: (process.env.EXPO_PUBLIC_APP_ENV ?? 'development') as
      | 'development'
      | 'staging'
      | 'production',
    deepseekApiUrl: process.env.DEEPSEEK_API_URL ?? '',
    deepseekApiKey: process.env.DEEPSEEK_API_KEY ?? '',
  };

  if (__DEV__) {
    requiredEnv.forEach(key => {
      if (!process.env[key]) {
        console.warn(`[ENV] ${key} is not set`);
      }
    });
  }

  return env;
};
