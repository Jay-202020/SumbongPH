import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function ReportsDashboard() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <ThemedText style={styles.pageTitle}>My Reports</ThemedText>

          {/* Search and Filter Row */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput 
                placeholder="Search reports..." 
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput} 
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter-outline" size={22} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
             <ReportCard 
                title="Uncollected Garbage at" 
                status="RECEIVED" 
                id="SMP2025121701" 
                desc="Garbage has been piling up for 3 days. Smell is getting bad."
                location="123 Main St, Brgy San"
                date="12/17/2023"
                icon="trash-outline"
             />
             <ReportCard 
                title="Broken Streetlight near" 
                status="IN PROGRESS" 
                id="SMP2025121605" 
                desc="Dark area causing safety concerns for students walking home."
                location="Rizal Ave corner Mabini St"
                date="12/17/2023"
                icon="bulb-outline"
                statusBlue
             />
             <ReportCard 
                title="Clogged Drainage" 
                status="RESOLVED" 
                id="SMP2025121502" 
                desc="Knee-deep water after 1 hour of rain."
                location="Purok 3, Interior Alley"
                date="12/15/2023"
                icon="water-outline"
                statusGreen
             />
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        {/* Navigation Bar */}
<View style={styles.tabBar}>
  <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home.dashboard')} />
  <TabIcon icon="document-text" label="Reports" active onPress={() => router.push('/reports.dashboard')} />
  <TabIcon icon="map-outline" label="Map" onPress={() => router.push('/maps.dashboard')} />
  <TabIcon icon="bulb-outline" label="Ideas" />
  <TabIcon icon="person-outline" label="Profile" />
</View>
      </SafeAreaView>
    </ThemedView>
  );
}

function ReportCard({ title, status, id, desc, location, date, icon, statusBlue, statusGreen }: any) {
  return (
    <View style={styles.reportCard}>
       <View style={styles.reportRow}>
          <View style={styles.iconBg}><Ionicons name={icon} size={22} color="#4B5563" /></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={styles.reportMainTitle}>{title}</ThemedText>
            <ThemedText style={styles.reportId}>ID: {id}</ThemedText>
          </View>
          <View style={[styles.statusBadge, statusBlue && {backgroundColor: '#DBEAFE'}, statusGreen && {backgroundColor: '#DCFCE7'}]}>
            <ThemedText style={[styles.statusText, statusBlue && {color: '#2563EB'}, statusGreen && {color: '#16A34A'}]}>{status}</ThemedText>
          </View>
       </View>
       <ThemedText style={styles.reportSnippet}>{desc}</ThemedText>
       <View style={styles.reportFooter}>
         <View style={styles.footerInfo}><Ionicons name="location-outline" size={14} color="#9CA3AF" /><ThemedText style={styles.footerLabel}>{location}</ThemedText></View>
         <View style={styles.footerInfo}><Ionicons name="time-outline" size={14} color="#9CA3AF" /><ThemedText style={styles.footerLabel}>{date}</ThemedText></View>
       </View>
    </View>
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
  content: { paddingHorizontal: 20, flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 20, marginBottom: 15 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 16, color: '#111827' },
  filterButton: { padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center' },
  reportCard: { backgroundColor: 'white', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  reportRow: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 14 },
  reportMainTitle: { fontWeight: '700', fontSize: 15, color: '#111827' },
  reportId: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  statusBadge: { backgroundColor: '#F3F4F6', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  reportSnippet: { color: '#4B5563', fontSize: 14, lineHeight: 20, marginVertical: 12 },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  footerInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerLabel: { fontSize: 12, color: '#9CA3AF' },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 15 },
  fab: { position: 'absolute', bottom: 100, right: 20, backgroundColor: '#2F70E9', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#2F70E9', shadowOpacity: 0.4, shadowRadius: 8, zIndex: 10 },
});