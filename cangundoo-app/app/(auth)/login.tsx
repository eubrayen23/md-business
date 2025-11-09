import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';
import { useState } from 'react';
import { loginSchema, type LoginFormValues } from '@features/auth/schema';
import { signIn } from '@features/auth/api';

export default function LoginScreen() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await signIn(values);
      router.replace('/(app)/(tabs)/home');
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
        Entrar no Cangundoo
      </Text>

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

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
        Acessar
      </Button>

      <Button mode="text" onPress={() => router.push('/(auth)/forgot-password')}>
        Esqueci minha senha
      </Button>

      <Button mode="outlined" onPress={() => router.push('/(auth)/signup')}>
        Criar nova conta
      </Button>
    </View>
  );
}
