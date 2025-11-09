import { supabase } from '@services/api/supabaseClient';
import { Property } from '@types/models';

export const fetchMyProperties = async (userId: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Property[];
};
