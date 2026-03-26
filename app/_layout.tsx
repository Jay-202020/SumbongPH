import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { auth } from '@/firebaseConfig';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const inLoginGroup = segments[0] === '(login)';
    const inLandingGroup = segments[0] === '(tabs)';
    const inSplash = segments[0] === 'splash';

    if (!user) {
      // Allow access to login, landing (tabs), and splash screens when logged out
      if (!inLoginGroup && !inLandingGroup && !inSplash) {
        router.replace('/(tabs)');
      }
      return;
    } else if (inLoginGroup || inLandingGroup || inSplash) {
      // Redirect authenticated users away from auth/landing screens
      router.replace('/(home_dasborad)/home.dashboard');
    }
  }, [isReady, router, segments, user]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="splash">
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(login)" options={{ headerShown: false }} />
        <Stack.Screen name="(home_dasborad)" options={{ headerShown: false }} />
        <Stack.Screen name="(reports_dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(maps.dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(ideas_dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}