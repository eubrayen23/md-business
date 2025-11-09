import { ScrollView, View, Alert, Linking } from 'react-native';
import { Avatar, Button, Divider, List, Text } from 'react-native-paper';
import { useAuthStore } from '@store/auth-store';
import { useMyProperties } from '@features/profile/hooks';
import { PropertyCard } from '@components/PropertyCard';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { profile, signOut } = useAuthStore();
  const { data: properties } = useMyProperties();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Avatar.Text
          size={64}
          label={profile?.name?.slice(0, 2).toUpperCase() ?? 'US'}
          style={{ backgroundColor: '#F97316' }}
        />
        <View style={{ flex: 1 }}>
          <Text variant="titleLarge">{profile?.name}</Text>
          <Text variant="bodyMedium">{profile?.email}</Text>
          <Text variant="bodyMedium">{profile?.phone}</Text>
        </View>
      </View>

      <Divider />

      <List.Section>
        <List.Item
          title="Editar perfil"
          onPress={() => router.push('/(app)/profile/edit-profile')}
          left={props => <List.Icon {...props} icon="account-edit" />}
        />
        <List.Item
          title="Configurar notificações push"
          onPress={() =>
            Alert.alert(
              'Notificações',
              'Para garantir notificações, mantenha o login ativo e permita alertas nas configurações do sistema.',
            )
          }
          left={props => <List.Icon {...props} icon="bell-outline" />}
        />
        <List.Item
          title="Ajuda"
          onPress={() => Linking.openURL('mailto:suporte@cangundoo.ao')}
          left={props => <List.Icon {...props} icon="help-circle-outline" />}
        />
      </List.Section>

      <Divider />

      <Text variant="titleMedium">Meus anúncios</Text>
      {properties?.length ? (
        properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            onPress={() => router.push({ pathname: '/(app)/property/[id]', params: { id: property.id } })}
          />
        ))
      ) : (
        <Text>Você ainda não publicou imóveis.</Text>
      )}

      <Button mode="outlined" onPress={() => signOut()} style={{ marginTop: 24 }}>
        Sair
      </Button>
    </ScrollView>
  );
}
