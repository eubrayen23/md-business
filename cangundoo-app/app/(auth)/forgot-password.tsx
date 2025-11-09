import { View } from 'react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { resetPassword } from '@features/auth/api';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(null);
    try {
      await resetPassword(values.email);
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
        Recuperar senha
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Enviaremos um email com instruções para redefinir sua senha.
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

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}
      {isSuccess ? (
        <HelperText type="info">Verifique seu email para continuar.</HelperText>
      ) : null}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
        Enviar instruções
      </Button>
    </View>
  );
}
