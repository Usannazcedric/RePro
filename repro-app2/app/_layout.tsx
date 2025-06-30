import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '../hooks/useColorScheme';
import { interFonts, nunitoFonts } from '../constants/Fonts';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    ...interFonts,
    ...nunitoFonts,
  });
  
  // État pour forcer le chargement après un timeout
  const [forceReady, setForceReady] = useState(false);
  
  // Timeout de sécurité : si les polices ne se chargent pas en 3 secondes, on continue
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceReady(true);
    }, 3000);

    if (fontsLoaded) {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [fontsLoaded]);

  // L'app est prête soit quand les polices sont chargées, soit après le timeout
  const appReady = fontsLoaded || forceReady;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  if (!appReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="boutique" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
