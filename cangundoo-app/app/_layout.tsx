import { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@layout/AppProviders';
import { useAuthStore } from '@store/auth-store';
import { supabase } from '@services/api/supabaseClient';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setSession, isLoading } = useAuthStore();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsAppReady(true);
      SplashScreen.hideAsync();
    };

    initAuth();
  }, [setSession]);

  if (!isAppReady || isLoading) {
    return null;
  }

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </AppProviders>
  );
}
