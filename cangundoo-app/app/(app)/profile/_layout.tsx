import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="manage/index" options={{ title: 'Gestão de anúncios' }} />
      <Stack.Screen name="manage/[propertyId]" options={{ title: 'Editar anúncio' }} />
      <Stack.Screen name="edit-profile" options={{ title: 'Editar perfil' }} />
    </Stack>
  );
}
