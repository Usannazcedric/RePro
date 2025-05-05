import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const segments = useSegments();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loaded) return;
  
    const isAtRoot = !segments[0] || segments[0] === '(tabs)';
    if (isAtRoot && !hasRedirected) {
      router.replace('/onboarding');
      setHasRedirected(true);
    } else {
      setHasRedirected(true);
    }
  }, [segments, router, loaded, hasRedirected]);
  

  if (!loaded || !hasRedirected) {
    return null; 
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
