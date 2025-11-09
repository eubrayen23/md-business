import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { propertyFormSchema, PropertyFormValues } from '@features/properties/schema';
import { usePropertyDetails } from '@features/properties/hooks';
import { useAuthStore } from '@store/auth-store';
import { supabase } from '@services/api/supabaseClient';

export default function EditListingScreen() {
  const params = useLocalSearchParams<{ propertyId: string | string[] }>();
  const propertyId = Array.isArray(params.propertyId) ? params.propertyId[0] : params.propertyId;
  const { profile } = useAuthStore();

  if (!propertyId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Imóvel não encontrado.</Text>
      </View>
    );
  }

  const { data } = usePropertyDetails(propertyId, profile?.id);

  const partialSchema = propertyFormSchema.partial();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Partial<PropertyFormValues>>({
    resolver: zodResolver(partialSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        price_kz: data.price_kz,
        location: data.location,
        city: data.city,
        property_type: data.property_type as any,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area_m2: data.area_m2,
        status: data.status,
        description: data.description,
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: Partial<PropertyFormValues>) => {
    try {
      await supabase.from('properties').update(values).eq('id', propertyId);
      Alert.alert('Sucesso', 'Anúncio atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  if (!data) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Carregando anúncio...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text variant="titleLarge">Editar anúncio</Text>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput label="Título" value={value} onChangeText={onChange} />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="price_kz"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput
              label="Preço (Kz)"
              keyboardType="numeric"
              value={value?.toString() ?? ''}
              onChangeText={text => onChange(Number(text.replace(/\D/g, '')))}
            />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Descrição"
            multiline
            numberOfLines={4}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
        Salvar alterações
      </Button>
    </ScrollView>
  );
}
