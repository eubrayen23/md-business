import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { useAuthStore } from '@store/auth-store';

export const useAuthRedirect = () => {
  const pathname = usePathname();
  const { session, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const isAuthenticated = Boolean(session);
    const isAuthRoute = pathname?.startsWith('/(auth)');
    const isPublicRoute = pathname?.startsWith('/(public)');

    if (isAuthenticated && (isPublicRoute || isAuthRoute)) {
      router.replace('/(app)/(tabs)/home');
    } else if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
      router.replace('/(public)/onboarding');
    }
  }, [session, pathname, isLoading]);
};
