import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@services/api/supabaseClient';
import { uploadPropertyImage } from '@services/api/storage';
import { deepSeekFetch } from '@services/ai/deepseek';
import { useAuthStore } from '@store/auth-store';
import { PropertyFormValues } from './schema';

export const useCreateProperty = () => {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      if (!profile?.id) throw new Error('Usuário não autenticado');

      let description = values.description;

      if (values.generateDescription && !description) {
        const { suggestions } = await deepSeekFetch({
          kind: 'property-description',
          prompt: `Crie uma descrição detalhada para um imóvel em Angola com as seguintes características: ${JSON.stringify(
            values,
          )}`,
        });
        description = suggestions[0];
      }

      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: values.title,
          description,
          price_kz: values.price_kz,
          location: values.location,
          city: values.city,
          property_type: values.property_type,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          area_m2: values.area_m2,
          status: values.status,
          user_id: profile.id,
        })
        .select()
        .single();

      if (error) throw error;

      const uploadedImages = await Promise.all(
        values.images.map(image => uploadPropertyImage(image, data.id)),
      );

      const { error: imageError } = await supabase
        .from('property_images')
        .insert(
          uploadedImages.map(url => ({
            property_id: data.id,
            image_url: url,
          })),
        );

      if (imageError) throw imageError;

      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });

      return data;
    },
  });
};
