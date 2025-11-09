import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

const baseColors = {
  primary: '#F97316',
  secondary: '#0F172A',
  tertiary: '#22D3EE',
  background: '#F8FAFC',
  surface: '#FFFFFF',
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    tertiary: baseColors.tertiary,
    background: baseColors.background,
    surface: baseColors.surface,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: baseColors.primary,
    secondary: '#D1D5DB',
    tertiary: baseColors.tertiary,
  },
};
