import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, useTheme } from 'react-native-paper';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'cangundoo.hasSeenOnboarding';

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeen = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (hasSeen) {
        router.replace('/(auth)/login');
      }
    };

    checkOnboarding();
  }, [router]);

  const handleStart = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.push('/(auth)/login');
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="displaySmall" style={{ fontWeight: '700', marginBottom: 16 }}>
        O marketplace imobiliário angolano
      </Text>
      <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 32 }}>
        Descubra, negocie e publique casas e terrenos com segurança. Pagamentos e preços sempre em
        Kz, com suporte de IA para descrições e negociações.
      </Text>
      <Button mode="contained" onPress={handleStart} style={{ marginBottom: 12 }}>
        Começar agora
      </Button>
      <Button mode="text" onPress={() => router.push('/(auth)/signup')}>
        Criar conta
      </Button>
    </View>
  );
}
