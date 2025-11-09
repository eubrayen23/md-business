import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@store/auth-store';
import {
  fetchProperties,
  fetchPropertyById,
  toggleFavorite,
  PropertyFilters,
} from './api';

export const usePropertyList = (filters: PropertyFilters) =>
  useInfiniteQuery({
    queryKey: ['properties', filters],
    queryFn: fetchProperties,
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.nextPage,
  });

export const usePropertyDetails = (propertyId: string, userId?: string) =>
  useQuery({
    queryKey: ['property', propertyId, userId],
    queryFn: () => fetchPropertyById(propertyId, userId),
    enabled: Boolean(propertyId),
  });

export const useToggleFavorite = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  return useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (!profile?.id) throw new Error('Usuário não autenticado');
      await toggleFavorite(propertyId, profile.id, isFavorite);
    },
    onMutate: async isFavorite => {
      await queryClient.cancelQueries({ queryKey: ['property', propertyId, profile?.id] });
      const previous = queryClient.getQueryData(['property', propertyId, profile?.id]);

      queryClient.setQueryData(['property', propertyId, profile?.id], (old: any) => ({
        ...old,
        is_favorite: !isFavorite,
      }));

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['property', propertyId, profile?.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId, profile?.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
