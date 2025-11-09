import { ScrollView, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useAuthStore } from '@store/auth-store';
import { supabase } from '@services/api/supabaseClient';
import { useEffect } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Informe o nome completo'),
  phone: z.string().min(9, 'Telefone inválido'),
});

type FormValues = z.infer<typeof schema>;

export default function EditProfileScreen() {
  const { profile, fetchProfile } = useAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
    },
  });

  useEffect(() => {
    reset({
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
    });
  }, [profile, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await supabase.from('users').update(values).eq('id', profile?.id);
      await fetchProfile();
      Alert.alert('Pronto', 'Perfil atualizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text variant="titleLarge">Atualizar perfil</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput label="Nome completo" value={value} onChangeText={onChange} />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput
              label="Telefone"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
        Salvar
      </Button>
    </ScrollView>
  );
}
