import { supabase } from '@services/api/supabaseClient';
import { Property } from '@types/models';

export type PropertyFilters = {
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const fetchProperties = async ({ pageParam = 0, queryKey }: any) => {
  const [, filters] = queryKey as [string, PropertyFilters];
  const PAGE_SIZE = 12;

  let query = supabase
    .from('properties')
    .select(
      '*, images:property_images(image_url), owner:users!properties_user_id_fkey(id, name, avatar_url, phone)',
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(pageParam * PAGE_SIZE, pageParam * PAGE_SIZE + PAGE_SIZE - 1);

  if (filters.city) {
    query = query.eq('city', filters.city);
  }
  if (filters.propertyType) {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters.minPrice) {
    query = query.gte('price_kz', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price_kz', filters.maxPrice);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    data: data as Property[],
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
  };
};

export const fetchPropertyById = async (propertyId: string, userId?: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select(
      '*, images:property_images(*), owner:users!properties_user_id_fkey(id, name, avatar_url, phone, email)',
    )
    .eq('id', propertyId)
    .single();

  if (error) {
    throw error;
  }

  const property = data as Property;

  if (userId) {
    const { data: favoriteData } = await supabase
      .from('user_favorites')
      .select('user_id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();

    property.is_favorite = Boolean(favoriteData);
  }

  return property;
};

export const toggleFavorite = async (propertyId: string, userId: string, isFavorite: boolean) => {
  if (isFavorite) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('user_favorites')
    .insert({
      user_id: userId,
      property_id: propertyId,
    })
    .select()
    .single();

  if (error) throw error;
};

export const fetchFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('properties(*)')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};
