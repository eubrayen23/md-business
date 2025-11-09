import { Redirect } from 'expo-router';
import { useAuthStore } from '@store/auth-store';

export default function Index() {
  const { session } = useAuthStore();

  if (session) {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  return <Redirect href="/(public)/onboarding" />;
}
