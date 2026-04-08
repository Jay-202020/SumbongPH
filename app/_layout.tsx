import { DarkTheme, DefaultTheme, ThemeProvider as NavigationProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './ThemeContext'; // Ensure this path is correct

function RootLayoutContent() {
  const { isDarkMode } = useTheme();

  return (
    <NavigationProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
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
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </NavigationProvider>
  );
}
// Inside your Stack in _layout.tsx
<Stack initialRouteName="splash">
  {/* ... existing screens ... */}
  <Stack.Screen name="edit-report" options={{ presentation: 'modal', title: 'Edit Report' }} />
</Stack>
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}