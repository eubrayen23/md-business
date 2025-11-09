import { ScrollView, View, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  HelperText,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { propertyFormSchema, type PropertyFormValues } from '@features/properties/schema';
import { useCreateProperty } from '@features/properties/mutations';
import { useState } from 'react';

const propertyTypes = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'outro', label: 'Outro' },
];

export default function PublishScreen() {
  const theme = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const createProperty = useCreateProperty();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price_kz: 0,
      location: '',
      city: '',
      property_type: 'casa',
      bedrooms: 0,
      bathrooms: 0,
      area_m2: 0,
      status: 'published',
      generateDescription: true,
      images: [],
    },
  });

  const images = watch('images');

  const handleAddImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Habilite o acesso às fotos para continuar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const newUris = result.assets?.map(asset => asset.uri) ?? [];
    setValue('images', [...images, ...newUris], { shouldValidate: true });
  };

  const onSubmit = async (values: PropertyFormValues) => {
    try {
      setIsUploading(true);
      await createProperty.mutateAsync(values);
      Alert.alert('Sucesso', 'Imóvel publicado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text variant="titleLarge">Publicar novo imóvel</Text>

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
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Descrição (opcional)"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
          />
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
        name="location"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput label="Endereço" value={value} onChangeText={onChange} />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput label="Cidade" value={value} onChangeText={onChange} />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="property_type"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons value={value} onValueChange={onChange} buttons={propertyTypes} />
        )}
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Controller
          control={control}
          name="bedrooms"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={{ flex: 1 }}
              label="Quartos"
              keyboardType="numeric"
              value={value?.toString() ?? ''}
              onChangeText={text => onChange(Number(text.replace(/\D/g, '')))}
            />
          )}
        />
        <Controller
          control={control}
          name="bathrooms"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={{ flex: 1 }}
              label="WC"
              keyboardType="numeric"
              value={value?.toString() ?? ''}
              onChangeText={text => onChange(Number(text.replace(/\D/g, '')))}
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="area_m2"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput
              label="Área (m²)"
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
        name="status"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'draft', label: 'Rascunho' },
              { value: 'published', label: 'Publicado' },
            ]}
          />
        )}
      />

      <Controller
        control={control}
        name="generateDescription"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Gerar descrição automaticamente com IA</Text>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />

      <View style={{ gap: 8 }}>
        <Text variant="titleMedium">Fotos</Text>
        <Button icon="image-plus" mode="outlined" onPress={handleAddImage}>
          Adicionar fotos
        </Button>
        <HelperText type={images.length ? 'info' : 'error'}>
          {images.length ? `${images.length} imagem(ns) selecionada(s)` : 'Necessário enviar imagens'}
        </HelperText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ gap: 8 }}>
          {images.map(uri => (
            <Image
              key={uri}
              source={{ uri }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                marginRight: 12,
                backgroundColor: theme.colors.surfaceVariant,
              }}
            />
          ))}
        </ScrollView>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting || isUploading}
        disabled={isSubmitting || isUploading}
      >
        Publicar imóvel
      </Button>
    </ScrollView>
  );
}
