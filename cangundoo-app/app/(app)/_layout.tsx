import { Stack } from 'expo-router';
import { useAuthRedirect } from '@lib/hooks/useAuthRedirect';
import { useRegisterPushToken } from '@features/notifications/hooks';

export default function AppLayout() {
  useAuthRedirect();
  useRegisterPushToken();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="property" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
