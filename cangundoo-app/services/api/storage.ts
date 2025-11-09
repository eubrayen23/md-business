import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@services/api/supabaseClient';

export const uploadPropertyImage = async (uri: string, propertyId: string) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1280 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );

  if (!manipResult.base64) throw new Error('Falha ao processar imagem');

  const fileName = `${propertyId}/${Date.now()}.jpg`;

  const buffer = decode(manipResult.base64);
  const fileContents = new Uint8Array(buffer);

  const { error } = await supabase.storage
    .from('property-images')
    .upload(fileName, fileContents, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from('property-images').getPublicUrl(fileName);

  return data.publicUrl;
};
