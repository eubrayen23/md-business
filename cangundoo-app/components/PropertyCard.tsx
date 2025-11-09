import { ImageBackground, View } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';
import { Property } from '@types/models';
import { formatPriceKz, truncate } from '@lib/utils/format';

type Props = {
  property: Property;
  onPress: () => void;
  onToggleFavorite?: () => void;
};

export const PropertyCard = ({ property, onPress, onToggleFavorite }: Props) => {
  const theme = useTheme();
  const cover = property.images?.[0]?.image_url;

  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        elevation: 3,
        marginBottom: 16,
      }}
    >
      {cover ? (
        <ImageBackground
          source={{ uri: cover }}
          resizeMode="cover"
          style={{ height: 180, justifyContent: 'flex-end' }}
        >
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.45)',
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text variant="titleMedium" style={{ color: '#fff' }}>
              {formatPriceKz(property.price_kz)}
            </Text>
            {onToggleFavorite ? (
              <IconButton
                icon={property.is_favorite ? 'heart' : 'heart-outline'}
                iconColor={property.is_favorite ? theme.colors.error : '#fff'}
                onPress={onToggleFavorite}
              />
            ) : null}
          </View>
        </ImageBackground>
      ) : (
        <View
          style={{
            height: 180,
            backgroundColor: theme.colors.surfaceVariant,
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text variant="titleMedium" style={{ color: '#fff' }}>
            {formatPriceKz(property.price_kz)}
          </Text>
          {onToggleFavorite ? (
            <IconButton
              icon={property.is_favorite ? 'heart' : 'heart-outline'}
              iconColor={property.is_favorite ? theme.colors.error : theme.colors.primary}
              onPress={onToggleFavorite}
            />
          ) : null}
        </View>
      )}
      <View style={{ padding: 16, gap: 8 }}>
        <Text variant="titleMedium">{property.title}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {truncate(property.description ?? '', 110)}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodySmall">{property.location}</Text>
          <Text variant="bodySmall">
            {property.bedrooms} quartos · {property.bathrooms} wc
          </Text>
        </View>
        <Button mode="outlined" onPress={onPress}>
          Ver detalhes
        </Button>
      </View>
    </View>
  );
};
