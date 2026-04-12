import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapsDashboardView from '../../components/MapsDashboardView';
import { useTheme } from '../ThemeContext';

export default function MapDashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <ThemedView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.mapHeader, isDarkMode && styles.darkHeader]}>
          <ThemedText style={[styles.headerTitle, isDarkMode && styles.darkText]}>
            Map
          </ThemedText>
        </View>

        <View style={[styles.mapCanvas, isDarkMode && styles.darkMapCanvas]}>
          <MapsDashboardView isDarkMode={isDarkMode} />
        </View>

        <View style={[styles.tabBar, isDarkMode && styles.darkTabBar]}>
          <TabIcon
            icon="home-outline"
            label="Home"
            onPress={() => router.push('/(home_dasborad)/home.dashboard')}
          />
          <TabIcon
            icon="document-text-outline"
            label="Reports"
            onPress={() => router.push('/(reports_dashboard)/reports.dashboard')}
          />
          <TabIcon
            icon="map"
            label="Maps"
            active
            onPress={() => router.push('/(maps.dashboard)/maps.dashboard')}
          />
          <TabIcon
            icon="bulb-outline"
            label="Ideas"
            onPress={() => router.push('/(ideas_dashboard)/ideas_dashboard')}
          />
          <TabIcon
            icon="person-outline"
            label="Profile"
            onPress={() => router.push('/profile')}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function TabIcon({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={24} color={active ? '#2F70E9' : '#9CA3AF'} />
      <ThemedText style={[styles.tabLabel, { color: active ? '#2F70E9' : '#9CA3AF' }]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0E7FF' },
  darkContainer: { backgroundColor: '#0F172A' },
  mapHeader: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  darkHeader: {
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  darkText: {
    color: '#F9FAFB',
  },
  mapCanvas: {
    flex: 1,
  },
  darkMapCanvas: {
    backgroundColor: '#0F172A',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 20,
  },
  darkTabBar: {
    backgroundColor: '#111827',
    borderTopColor: '#374151',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
});