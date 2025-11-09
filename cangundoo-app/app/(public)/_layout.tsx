import { Stack } from 'expo-router';
import { useAuthRedirect } from '@lib/hooks/useAuthRedirect';

export default function PublicLayout() {
  useAuthRedirect();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
