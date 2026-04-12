import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

const ComplaintsDashboard = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');
  const [priority, setPriority] = useState('All Priorities');

  const complaintsData = [
    { id: 'SBP-2025-0142', title: 'Loud karaoke past 10PM', complainant: 'Jose Rizal', category: 'Noise', priority: 'Medium', status: 'In Progress', assigned: 'Pedro Penduko', pColor: '#FEF3C7', pText: '#B45309', sColor: '#DBEAFE', sText: '#1E40AF' },
    { id: 'SBP-2025-0143', title: 'Clogged drainage on Rizal Street', complainant: 'Andres Bonifacio', category: 'Flood', priority: 'High', status: 'Under Review', assigned: 'Unassigned', pColor: '#FFEDD5', pText: '#9A3412', sColor: '#E0F2FE', sText: '#0369A1' },
    { id: 'SBP-2025-0144', title: 'Stray dogs near daycare center', complainant: 'Gabriela Silang', category: 'Safety', priority: 'Critical', status: 'Resolved', assigned: 'Pedro Penduko', pColor: '#FEE2E2', pText: '#991B1B', sColor: '#DCFCE7', sText: '#166534' },
    { id: 'SBP-2025-0145', title: 'Busted bulb near Park', complainant: 'Apolinario Mabini', category: 'Street Light', priority: 'Low', status: 'Pending', assigned: 'Unassigned', pColor: '#F3F4F6', pText: '#374151', sColor: '#FEF3C7', sText: '#B45309' },
    { id: 'SBP-2025-0146', title: 'Uncollected trash pile', complainant: 'Juan Luna', category: 'Garbage', priority: 'Medium', status: 'Pending', assigned: 'Unassigned', pColor: '#FEF3C7', pText: '#B45309', sColor: '#FEF3C7', sText: '#B45309' },
  ];

  const filteredData = useMemo(() => {
    return complaintsData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = category === 'All Categories' || item.category === category;
      const matchesStat = status === 'All Statuses' || item.status === status;
      const matchesPri = priority === 'All Priorities' || item.priority === priority;

      return matchesSearch && matchesCat && matchesStat && matchesPri;
    });
  }, [searchQuery, category, status, priority]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={isDesktop ? styles.desktopPadding : styles.mobilePadding}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navBar}>
          <Text style={styles.logo}>SumbongPH</Text>
          {isDesktop && (
            <View style={styles.navLinks}>
              <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/admin.dashboard')}>
                <Text style={styles.navItem}>Overview</Text>
              </TouchableOpacity>

              <View style={styles.activeTabWrapper}>
                <Text style={styles.activeNavItem}>Complaints</Text>
              </View>

              <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/maps.dashboard')}>
                <Text style={styles.navItem}>Map</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/users.dashboard')}>
                <Text style={styles.navItem}>Users</Text>
              </TouchableOpacity>

              <Text style={styles.navItem}>Reports</Text>
            </View>
          )}
          <Text style={styles.userName}>Kap. Roberto Santos</Text>
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.mainTitle}>Complaints Management</Text>
            <Text style={styles.subtitle}>Review, assign, and resolve resident complaints.</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addBtnText}>New Record</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersCard}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by ID or title"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterChipsRow}>
            <FilterChip label={category} onPress={() => setCategory('All Categories')} />
            <FilterChip label={status} onPress={() => setStatus('All Statuses')} />
            <FilterChip label={priority} onPress={() => setPriority('All Priorities')} />
          </View>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnLabel, { flex: 2.2 }]}>Complaint</Text>
            <Text style={styles.columnLabel}>Category</Text>
            <Text style={styles.columnLabel}>Priority</Text>
            <Text style={styles.columnLabel}>Status</Text>
            <Text style={styles.columnLabel}>Assigned</Text>
          </View>

          {filteredData.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No complaints found.</Text>
            </View>
          ) : (
            filteredData.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <View style={[styles.complaintCell, { flex: 2.2 }]}>
                  <View style={styles.dot} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.rowId}>{item.id}</Text>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.rowSub}>By {item.complainant}</Text>
                  </View>
                </View>

                <Text style={styles.rowText}>{item.category}</Text>

                <View style={styles.badgeContainer}>
                  <View style={[styles.badge, { backgroundColor: item.pColor }]}>
                    <Text style={[styles.badgeText, { color: item.pText }]}>{item.priority}</Text>
                  </View>
                </View>

                <View style={styles.badgeContainer}>
                  <View style={[styles.badge, { backgroundColor: item.sColor }]}>
                    <Text style={[styles.badgeText, { color: item.sText }]}>{item.status}</Text>
                  </View>
                </View>

                <Text style={styles.rowText}>{item.assigned}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function FilterChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.filterChip} onPress={onPress}>
      <Text style={styles.filterChipText}>{label}</Text>
      <Ionicons name="chevron-down" size={14} color="#6B7280" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  mobilePadding: { padding: 20 },
  desktopPadding: { paddingHorizontal: '10%', paddingVertical: 40 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 60 },
  logo: { fontSize: 18, fontWeight: '900' },
  navLinks: { flexDirection: 'row', gap: 30, alignItems: 'center' },
  navItem: { fontSize: 13, color: '#AAA', fontWeight: '500' },
  activeTabWrapper: { borderBottomWidth: 2, borderBottomColor: '#FF6B00', paddingBottom: 4 },
  activeNavItem: { fontSize: 13, color: '#000', fontWeight: '700' },
  userName: { fontSize: 13, fontWeight: '600' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  mainTitle: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  addBtn: {
    backgroundColor: '#FF9F00',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  filtersCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#111827',
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  filterChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },

  tableCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  columnLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  complaintCell: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2.2,
    marginRight: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  rowId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B00',
    marginBottom: 2,
  },
  rowTitle: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  rowText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    marginRight: 8,
  },
  badgeContainer: {
    flex: 1,
    marginRight: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#AAA',
    fontSize: 14,
  },
});

export default ComplaintsDashboard;