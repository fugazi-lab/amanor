/*
    the layout of the app
*/

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* 1. Welcome Screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* 2. Auth Screen (login / signup) */}
        <Stack.Screen name="auth" options={{ headerShown: false }} />

        {/* 3. Home Screen (landing pad after login) */}
        <Stack.Screen name="home" options={{ headerShown: false }} />

        {/* 4. The Main App (Drawer) */}
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

        {/* Modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}