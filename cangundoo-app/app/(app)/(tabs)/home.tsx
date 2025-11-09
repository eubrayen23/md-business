import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { FiltersBar } from '@features/properties/components/FiltersBar';
import { PropertyFilters } from '@features/properties/api';
import { usePropertyList } from '@features/properties/hooks';
import { PropertyCard } from '@components/PropertyCard';

export default function HomeScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { data, isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, isRefetching } =
    usePropertyList(filters);

  const properties = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={properties}
      keyExtractor={item => item.id}
      ListHeaderComponent={<FiltersBar onApplyFilters={setFilters} />}
      renderItem={({ item }) => (
        <PropertyCard
          property={item}
          onPress={() => router.push({ pathname: '/(app)/property/[id]', params: { id: item.id } })}
        />
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 12 }}>Carregando imóveis em destaque...</Text>
          </View>
        ) : (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <Text>Nenhum imóvel encontrado com os filtros selecionados.</Text>
          </View>
        )
      }
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#F97316" />
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}
