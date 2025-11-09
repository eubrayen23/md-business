import { ScrollView } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useMyProperties } from '@features/profile/hooks';
import { formatPriceKz } from '@lib/utils/format';
import { useRouter } from 'expo-router';

export default function ManageListingsScreen() {
  const { data } = useMyProperties();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {data?.map(property => (
        <Card key={property.id}>
          <Card.Title title={property.title} subtitle={formatPriceKz(property.price_kz)} />
          <Card.Content>
            <Text>Status: {property.status}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.push({ pathname: '/(app)/property/[id]', params: { id: property.id } })}>
              Ver anúncio
            </Button>
            <Button
              onPress={() =>
                router.push({ pathname: '/(app)/profile/manage/[propertyId]', params: { propertyId: property.id } })
              }
            >
              Editar
            </Button>
          </Card.Actions>
        </Card>
      ))}
      {!data?.length ? <Text>Você ainda não tem anúncios publicados.</Text> : null}
    </ScrollView>
  );
}
