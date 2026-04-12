import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

type AdminComplaintItem = {
  id: string;
  reportCode: string;
  title: string;
  complainant: string;
  category: string;
  priority: string;
  status: string;
  location: string;
};

const CATEGORY_OPTIONS = [
  'All Categories',
  'Flood',
  'Garbage',
  'Road',
  'Streetlight',
  'Noise',
  'Safety',
  'Other',
];

const STATUS_OPTIONS = [
  'All Statuses',
  'Pending',
  'Under Review',
  'In Progress',
  'Resolved',
];

const PRIORITY_OPTIONS = [
  'All Priorities',
  'Low',
  'Medium',
  'High',
  'Critical',
];

const STATUS_CHOICES = ['Pending', 'Under Review', 'In Progress', 'Resolved'];

const normalizeStatus = (status: unknown) => {
  const value = String(status ?? '').trim().toLowerCase();

  switch (value) {
    case 'resolved':
      return 'Resolved';
    case 'in progress':
    case 'in-progress':
      return 'In Progress';
    case 'under review':
    case 'under-review':
      return 'Under Review';
    case 'pending':
    default:
      return 'Pending';
  }
};

const getPriorityStyle = (priority: string) => {
  switch (String(priority).trim().toLowerCase()) {
    case 'critical':
      return { bg: '#FEE2E2', text: '#991B1B' };
    case 'high':
      return { bg: '#FFEDD5', text: '#9A3412' };
    case 'medium':
      return { bg: '#FEF3C7', text: '#B45309' };
    case 'low':
    default:
      return { bg: '#F3F4F6', text: '#374151' };
  }
};

const getStatusStyle = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'Resolved':
      return { bg: '#DCFCE7', text: '#166534' };
    case 'In Progress':
      return { bg: '#DBEAFE', text: '#1E40AF' };
    case 'Under Review':
      return { bg: '#E0F2FE', text: '#0369A1' };
    case 'Pending':
    default:
      return { bg: '#FEF3C7', text: '#B45309' };
  }
};

const getCategoryDotColor = (category: string) => {
  switch (category) {
    case 'Flood':
      return '#A855F7';
    case 'Garbage':
      return '#22C55E';
    case 'Road':
      return '#F97316';
    case 'Streetlight':
      return '#EF4444';
    case 'Noise':
      return '#8B5CF6';
    case 'Safety':
      return '#DC2626';
    default:
      return '#D1D5DB';
  }
};

const FilterChip = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.filterChip} onPress={onPress}>
      <Text style={styles.filterChipText}>{label}</Text>
      <Ionicons name="chevron-down" size={14} color="#6B7280" />
    </TouchableOpacity>
  );
};

const ComplaintsDashboard = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');
  const [priority, setPriority] = useState('All Priorities');

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [priorityIndex, setPriorityIndex] = useState(0);

  const [complaintsData, setComplaintsData] = useState<AdminComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<AdminComplaintItem | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'reports'),
      (snapshot) => {
        const data: AdminComplaintItem[] = snapshot.docs.map((docSnap) => {
          const raw = docSnap.data() as any;

          return {
            id: docSnap.id,
            reportCode: raw.reportCode || 'No Code',
            title: raw.title || 'Untitled Complaint',
            complainant: raw.userName || raw.userEmail || 'Unknown User',
            category: raw.category || 'Other',
            priority: raw.urgency || 'Low',
            status: normalizeStatus(raw.status),
            location: raw.location || 'No location',
          };
        });

        setComplaintsData(data);
        setLoading(false);
      },
      (error) => {
        console.log('ADMIN COMPLAINTS ERROR:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredData = useMemo(() => {
    return complaintsData.filter((item) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        item.reportCode.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.complainant.toLowerCase().includes(query);

      const matchesCat = category === 'All Categories' || item.category === category;
      const matchesStat = status === 'All Statuses' || item.status === status;
      const matchesPri = priority === 'All Priorities' || item.priority === priority;

      return matchesSearch && matchesCat && matchesStat && matchesPri;
    });
  }, [complaintsData, searchQuery, category, status, priority]);

  const handleCategoryPress = () => {
    const nextIndex = (categoryIndex + 1) % CATEGORY_OPTIONS.length;
    setCategoryIndex(nextIndex);
    setCategory(CATEGORY_OPTIONS[nextIndex]);
  };

  const handleStatusPress = () => {
    const nextIndex = (statusIndex + 1) % STATUS_OPTIONS.length;
    setStatusIndex(nextIndex);
    setStatus(STATUS_OPTIONS[nextIndex]);
  };

  const handlePriorityPress = () => {
    const nextIndex = (priorityIndex + 1) % PRIORITY_OPTIONS.length;
    setPriorityIndex(nextIndex);
    setPriority(PRIORITY_OPTIONS[nextIndex]);
  };

  const openStatusChoices = (item: AdminComplaintItem) => {
    setSelectedComplaint(item);
    setStatusModalVisible(true);
  };

  const closeStatusModal = () => {
    setStatusModalVisible(false);
    setSelectedComplaint(null);
  };

  const createStatusNotification = async (
    reportId: string,
    newStatus: string
  ) => {
    const reportRef = doc(db, 'reports', reportId);
    const reportSnap = await getDoc(reportRef);

    if (!reportSnap.exists()) {
      throw new Error('Report not found.');
    }

    const reportData = reportSnap.data() as any;
    const userId = reportData.userId;
    const reportTitle =
      reportData.title || reportData.description || 'Your report';
    const reportCode = reportData.reportCode || '';
    const oldStatus = normalizeStatus(reportData.status);

    if (!userId) {
      throw new Error('Missing userId in report document.');
    }

    await updateDoc(reportRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });

    if (oldStatus !== newStatus) {
      await addDoc(collection(db, 'notifications'), {
        userId,
        reportId,
        title: 'Report Status Updated',
        message: reportCode
          ? `Your report ${reportCode} is now marked as ${newStatus}.`
          : `${reportTitle} is now marked as ${newStatus}.`,
        type: 'report_status',
        status: newStatus,
        read: false,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleSetStatus = async (newStatus: string) => {
    if (!selectedComplaint) return;

    try {
      setUpdatingId(selectedComplaint.id);

      await createStatusNotification(selectedComplaint.id, newStatus);

      closeStatusModal();
      Alert.alert('Success', `Complaint status updated to ${newStatus}.`);
    } catch (error: any) {
      console.log('SET STATUS ERROR:', error);

      if (String(error?.message || '').includes('Missing userId')) {
        Alert.alert(
          'Notification Failed',
          'The report status was not updated because this report has no userId yet. Add userId when saving reports first.'
        );
      } else {
        Alert.alert('Update Failed', 'Could not update complaint status.');
      }
    } finally {
      setUpdatingId(null);
    }
  };

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

              <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/analytics.dashboard')}>
                <Text style={styles.navItem}>Report Analytics</Text>
              </TouchableOpacity>
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
            <Ionicons name="sync" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>Live Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersCard}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by code, title, complainant, or location"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterChipsRow}>
            <FilterChip label={category} onPress={handleCategoryPress} />
            <FilterChip label={status} onPress={handleStatusPress} />
            <FilterChip label={priority} onPress={handlePriorityPress} />
          </View>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard label="Total" value={complaintsData.length} />
          <SummaryCard
            label="Pending"
            value={complaintsData.filter((item) => item.status === 'Pending').length}
          />
          <SummaryCard
            label="Under Review"
            value={complaintsData.filter((item) => item.status === 'Under Review').length}
          />
          <SummaryCard
            label="Resolved"
            value={complaintsData.filter((item) => item.status === 'Resolved').length}
          />
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnLabel, { flex: 2.4 }]}>Complaint</Text>
            <Text style={styles.columnLabel}>Category</Text>
            <Text style={styles.columnLabel}>Priority</Text>
            <Text style={styles.columnLabel}>Status</Text>
            <Text style={[styles.columnLabel, { flex: 2 }]}>Actions</Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#FF9F00" />
              <Text style={styles.loadingText}>Loading complaints...</Text>
            </View>
          ) : filteredData.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No complaints found.</Text>
            </View>
          ) : (
            filteredData.map((item) => {
              const priorityStyle = getPriorityStyle(item.priority);
              const statusStyle = getStatusStyle(item.status);
              const isUpdating = updatingId === item.id;

              return (
                <View key={item.id} style={styles.tableRow}>
                  <View style={[styles.complaintCell, { flex: 2.4 }]}>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: getCategoryDotColor(item.category) },
                      ]}
                    />

                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={styles.rowId}>{item.reportCode}</Text>
                      <Text style={styles.rowTitle}>{item.title}</Text>
                      <Text style={styles.rowSub}>By {item.complainant}</Text>
                      <Text style={styles.rowSub}>📍 {item.location}</Text>
                    </View>
                  </View>

                  <Text style={styles.rowText}>{item.category}</Text>

                  <View style={styles.badgeContainer}>
                    <View style={[styles.badge, { backgroundColor: priorityStyle.bg }]}>
                      <Text style={[styles.badgeText, { color: priorityStyle.text }]}>
                        {item.priority}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.badgeContainer}>
                    <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionsCell}>
                    <TouchableOpacity
                      style={[styles.actionBtn, isUpdating && styles.disabledActionBtn]}
                      onPress={() => openStatusChoices(item)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons name="create-outline" size={14} color="#FFF" />
                          <Text style={styles.actionBtnText}>Change Status</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <Modal
        visible={statusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeStatusModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeStatusModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Update Complaint Status</Text>

            {selectedComplaint && (
              <Text style={styles.modalSubtitle}>
                {selectedComplaint.reportCode} • {selectedComplaint.title}
              </Text>
            )}

            {STATUS_CHOICES.map((itemStatus) => {
              const isCurrent = selectedComplaint?.status === itemStatus;
              const statusStyle = getStatusStyle(itemStatus);

              return (
                <TouchableOpacity
                  key={itemStatus}
                  style={[
                    styles.statusChoiceBtn,
                    isCurrent && {
                      borderColor: statusStyle.text,
                      backgroundColor: statusStyle.bg,
                    },
                  ]}
                  onPress={() => handleSetStatus(itemStatus)}
                >
                  <Text
                    style={[
                      styles.statusChoiceText,
                      isCurrent && { color: statusStyle.text },
                    ]}
                  >
                    {itemStatus}
                  </Text>

                  {isCurrent && (
                    <Ionicons name="checkmark-circle" size={18} color={statusStyle.text} />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.cancelModalBtn} onPress={closeStatusModal}>
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  mobilePadding: { padding: 20 },
  desktopPadding: { paddingHorizontal: '10%', paddingVertical: 40 },

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: { fontSize: 18, fontWeight: '900' },
  navLinks: { flexDirection: 'row', gap: 30, alignItems: 'center' },
  navItem: { fontSize: 13, color: '#AAA', fontWeight: '500' },
  activeTabWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
    paddingBottom: 4,
  },
  activeNavItem: { fontSize: 13, color: '#000', fontWeight: '700' },
  userName: { fontSize: 13, fontWeight: '600' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
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
    marginBottom: 16,
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

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  summaryCard: {
    minWidth: 120,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#9A3412',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9A3412',
    marginTop: 4,
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
    flex: 2.4,
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

  actionsCell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  disabledActionBtn: {
    opacity: 0.65,
  },

  loadingBox: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 10,
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#AAA',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  statusChoiceBtn: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusChoiceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  cancelModalBtn: {
    marginTop: 4,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelModalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default ComplaintsDashboard;