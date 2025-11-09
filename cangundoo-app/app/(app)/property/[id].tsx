import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Button, Chip, IconButton, Text, useTheme } from 'react-native-paper';
import { useAuthStore } from '@store/auth-store';
import { usePropertyDetails, useToggleFavorite } from '@features/properties/hooks';
import { formatArea, formatPriceKz } from '@lib/utils/format';
import { useMemo } from 'react';
import { Alert } from 'react-native';
import { Image } from 'expo-image';
import { useEnsureChat } from '@features/chat/hooks';

export default function PropertyDetailsScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const theme = useTheme();
  const router = useRouter();
  const { profile } = useAuthStore();

  if (!id) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Imóvel não encontrado.</Text>
      </View>
    );
  }

  const { data, isLoading, error } = usePropertyDetails(id, profile?.id);
  const toggleFavorite = useToggleFavorite(id);
  const ensureChat = useEnsureChat();

  const isOwner = useMemo(() => profile?.id === data?.user_id, [profile?.id, data?.user_id]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text variant="titleMedium">Não foi possível carregar o imóvel.</Text>
        <Button onPress={() => router.back()} style={{ marginTop: 12 }}>
          Voltar
        </Button>
      </View>
    );
  }

  const isFavorite = Boolean(data.is_favorite);
  const images = data.images ?? [];

  const handleStartChat = async () => {
    if (!profile?.id) {
      router.push('/(auth)/login');
      return;
    }

    try {
      const chat = await ensureChat.mutateAsync({ propertyId: data.id, sellerId: data.user_id });
      router.push({ pathname: '/(app)/chat/[id]', params: { id: chat.id } });
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {images.length ? (
          images.map(image => (
            <Image
              key={image.id}
              source={{ uri: image.image_url }}
              style={{ width: 360, height: 260 }}
              contentFit="cover"
            />
          ))
        ) : (
          <View
            style={{
              width: 360,
              height: 260,
              backgroundColor: theme.colors.surfaceVariant,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>Nenhuma imagem disponível</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text variant="headlineSmall">{data.title}</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
              {formatPriceKz(data.price_kz)}
            </Text>
          </View>
          {!isOwner ? (
            <IconButton
              icon={isFavorite ? 'heart' : 'heart-outline'}
              onPress={() => toggleFavorite.mutate(isFavorite)}
              iconColor={isFavorite ? theme.colors.error : theme.colors.primary}
            />
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip icon="map-marker">{data.location}</Chip>
          <Chip icon="home-city">{data.city}</Chip>
          <Chip icon="shape">{data.property_type}</Chip>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Chip icon="bed">{data.bedrooms} quartos</Chip>
          <Chip icon="shower">{data.bathrooms} wc</Chip>
          <Chip icon="ruler-square">{formatArea(data.area_m2)}</Chip>
        </View>

        <Text variant="titleMedium">Descrição</Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {data.description}
        </Text>

        <Text variant="titleMedium">Proprietário</Text>
        <View style={{ gap: 4 }}>
          <Text>{data.owner?.name}</Text>
          <Text>{data.owner?.phone}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {isOwner ? (
            <Button mode="contained-tonal" onPress={() => router.push('/(app)/profile/manage/index')}>
            Gerenciar anúncio
          </Button>
        ) : (
          <>
            <Button mode="contained" onPress={handleStartChat} loading={ensureChat.isPending}>
              Negociar com vendedor
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.push({ pathname: '/(app)/chat/assistant', params: { propertyId: data.id } })}
            >
              Receber sugestão da IA
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
}
