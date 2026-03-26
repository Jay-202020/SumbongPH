import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

type ProfileOption = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  showDot?: boolean;
};

const profileOptions: ProfileOption[] = [
  { icon: 'person-outline', label: 'Personal Information' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'moon-outline', label: 'Dark Mode', value: 'Off', showDot: true },
  { icon: 'help-circle-outline', label: 'Help & Support' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>AG</ThemedText>
            </View>
            <ThemedText style={styles.name}>ALEX GONZALES</ThemedText>
            <ThemedText style={styles.location}>San Antonio</ThemedText>

            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            {profileOptions.map((option, index) => (
              <View
                key={option.label}
                style={[
                  styles.menuItem,
                  index !== profileOptions.length - 1 && styles.menuItemBorder,
                ]}>
                <View style={styles.menuLeft}>
                  <Ionicons name={option.icon} size={22} color="#4B5563" />
                  <ThemedText style={styles.menuLabel}>{option.label}</ThemedText>
                </View>

                <View style={styles.menuRight}>
                  {option.value ? (
                    <ThemedText style={styles.menuValue}>{option.value}</ThemedText>
                  ) : null}
                  {option.showDot ? <View style={styles.notificationDot} /> : null}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/(home_dasborad)/home.dashboard')} />
          <TabIcon icon="document-text-outline" label="Reports" onPress={() => router.push('/(reports_dashboard)/reports.dashboard')} />
          <TabIcon icon="map-outline" label="Maps" onPress={() => router.push('/(maps.dashboard)/maps.dashboard')} />
          <TabIcon icon="bulb-outline" label="Ideas" onPress={() => router.push('/(ideas_dashboard)/ideas_dashboard')} />
          <TabIcon icon="person" label="Profile" active onPress={() => router.push('/profile')} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function TabIcon({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={24} color={active ? '#2F70E9' : '#9CA3AF'} />
      <ThemedText style={[styles.tabLabel, { color: active ? '#2F70E9' : '#9CA3AF' }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 110,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7C83E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 18,
  },
  editButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
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
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});
