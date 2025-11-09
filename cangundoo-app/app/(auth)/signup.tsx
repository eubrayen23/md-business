import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { signupSchema, type SignupFormValues } from '@features/auth/schema';
import { signUp } from '@features/auth/api';

export default function SignupScreen() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setErrorMessage(null);
    try {
      await signUp(values);
      router.replace('/(auth)/login');
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 12 }}>
        Criar conta
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <TextInput label="Nome completo" onBlur={onBlur} value={value} onChangeText={onChange} />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <TextInput
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <TextInput
              label="Telefone"
              keyboardType="phone-pad"
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <TextInput
              label="Senha"
              secureTextEntry
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <TextInput
              label="Confirmar senha"
              secureTextEntry
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <Checkbox.Item
              label="Aceito os Termos de uso e Política de privacidade"
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
            />
            <HelperText type={fieldState.error ? 'error' : 'info'}>
              {fieldState.error?.message ?? ''}
            </HelperText>
          </>
        )}
      />

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
        Cadastrar
      </Button>

      <Button mode="text" onPress={() => router.push('/(auth)/login')}>
        Já tenho conta
      </Button>
    </ScrollView>
  );
}
