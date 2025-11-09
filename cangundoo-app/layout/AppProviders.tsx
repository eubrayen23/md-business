import { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, useColorScheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from '@lib/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => (colorScheme === 'dark' ? darkTheme : lightTheme), [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>{children}</PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
