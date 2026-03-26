import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.welcomeLabel}>Welcome back,</ThemedText>
              <ThemedText style={styles.userName}>ALEX RESIDENT</ThemedText>
            </View>
            <View style={styles.headerIcons}>
              <View>
                <Ionicons name="notifications-outline" size={28} color="#4B5563" />
                <View style={styles.badgeDot} />
              </View>
              <Image source={{ uri: 'https://i.pravatar.cc/100?u=alex' }} style={styles.avatar} />
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.row}>
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <ThemedText style={styles.statTitle}>Pending</ThemedText>
                <View style={[styles.statIconWrap, { backgroundColor: '#FFF7ED' }]}>
                  <Ionicons name="time-outline" size={20} color="#F97316" />
                </View>
              </View>
              <ThemedText style={styles.statNumber}>2</ThemedText>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <ThemedText style={styles.statTitle}>Resolved</ThemedText>
                <View style={[styles.statIconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#22C55E" />
                </View>
              </View>
              <ThemedText style={styles.statNumber}>0</ThemedText>
            </View>
          </View>

          {/* Alert Banner */}
          <View style={styles.alertBanner}>
            <View style={styles.alertTop}>
              <Ionicons name="warning-outline" size={20} color="white" />
              <ThemedText style={styles.alertLabel}>Community Alert</ThemedText>
            </View>
            <ThemedText style={styles.alertHeading}>Heavy Rainfall Warning</ThemedText>
            <ThemedText style={styles.alertDesc}>Orange rainfall warning raised in Metro Manila. Expect flooding in low-lying areas.</ThemedText>
            <View style={styles.triangleGraphic}>
               <Ionicons name="warning-outline" size={100} color="rgba(255,255,255,0.15)" />
            </View>
          </View>

          {/* Recent Reports Section */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Reports</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(reports_dashboard)/reports.dashboard')}>
              <ThemedText style={styles.viewAll}>View All</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.reportCard}>
            <View style={styles.reportRow}>
              <View style={styles.iconBg}><Ionicons name="trash-outline" size={22} color="#4B5563" /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.reportMainTitle}>Uncollected Garbage</ThemedText>
                <ThemedText style={styles.reportId}>ID: SMP2025121701</ThemedText>
              </View>
              <View style={styles.statusBadge}><ThemedText style={styles.statusText}>RECEIVED</ThemedText></View>
            </View>
          </View>

        </ScrollView>
        
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        {/* Bottom Tab Bar */}
<View style={styles.tabBar}>
  <TabIcon icon="home" label="Home" active onPress={() => router.push('/(home_dasborad)/home.dashboard')} />
  <TabIcon icon="document-text-outline" label="Reports" onPress={() => router.push('/(reports_dashboard)/reports.dashboard')} />
  <TabIcon icon="map-outline" label="Maps" onPress={() => router.push('/(maps.dashboard)/maps.dashboard')} />
  <TabIcon icon="bulb-outline" label="Ideas" onPress={() => router.push('/(ideas_dashboard)/ideas_dashboard')} />
  <TabIcon icon="person-outline" label="Profile" onPress={() => router.push('/profile')} />
</View>
      </SafeAreaView>
    </ThemedView>
  );
}

function TabIcon({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={{ alignItems: 'center' }} onPress={onPress} activeOpacity={0.6}>
      <Ionicons name={icon} size={24} color={active ? '#2F70E9' : '#9CA3AF'} />
      <ThemedText style={{ fontSize: 10, color: active ? '#2F70E9' : '#9CA3AF', marginTop: 4, fontWeight: '600' }}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  welcomeLabel: { color: '#6B7280', fontSize: 14 },
  userName: { fontSize: 22, fontWeight: '800', color: '#111827' },
  headerIcons: { flexDirection: 'row', gap: 15 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#F3F4F6' },
  badgeDot: { position: 'absolute', right: 2, top: 2, width: 10, height: 10, backgroundColor: '#EF4444', borderRadius: 5, borderWidth: 2, borderColor: 'white', zIndex: 1 },
  row: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statBox: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6', backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  statTitle: { color: '#6B7280', fontWeight: '500' },
  statIconWrap: { padding: 8, borderRadius: 12 },
  statNumber: { fontSize: 32, fontWeight: '700', color: '#111827' },
  alertBanner: { backgroundColor: '#2F70E9', borderRadius: 20, padding: 20, marginBottom: 30, overflow: 'hidden', position: 'relative' },
  alertTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  alertLabel: { color: 'white', fontWeight: '600' },
  alertHeading: { color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 5 },
  alertDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18, width: '80%' },
  triangleGraphic: { position: 'absolute', right: -15, bottom: -15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  viewAll: { color: '#2F70E9', fontWeight: '600' },
  reportCard: { backgroundColor: 'white', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  reportRow: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 14 },
  reportMainTitle: { fontWeight: '700', fontSize: 16, color: '#111827' },
  reportId: { color: '#9CA3AF', fontSize: 12 },
  statusBadge: { backgroundColor: '#F3F4F6', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#2F70E9', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#2F70E9', shadowOpacity: 0.3, shadowRadius: 5 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 15 },
});
