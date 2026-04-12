import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth, db } from '@/firebaseConfig';
import { ReportItem } from '@/models/report';
import {
  formatTimeAgo,
  getCategoryIcon,
  getPendingReportsCount,
  getRecentReports,
  getResolvedReportsCount,
  getStatusStyle,
  subscribeToMyReports,
} from '@/services/reportService';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../ThemeContext';

type UserProfile = {
  uid?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  barangay?: string;
  role?: string;
};

export default function HomeDashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setLoadingProfile(false);
          return;
        }

        const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();

          setUserProfile({
            uid: docData.uid,
            name: docData.name || currentUser.displayName || 'User',
            email: docData.email || currentUser.email || '',
            mobileNumber: docData.mobileNumber || '',
            barangay: docData.barangay || '',
            role: docData.role || 'user',
          });
        } else {
          setUserProfile({
            uid: currentUser.uid,
            name: currentUser.displayName || 'User',
            email: currentUser.email || '',
            mobileNumber: '',
            barangay: '',
            role: 'user',
          });
        }
      } catch (error) {
        console.log('DASHBOARD PROFILE ERROR:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMyReports(
      (data) => {
        setReports(data);
        setLoadingReports(false);
      },
      (error) => {
        console.log('HOME REPORT SUBSCRIPTION ERROR:', error);
        setReports([]);
        setLoadingReports(false);
      }
    );

    return unsubscribe;
  }, []);

  const pendingCount = useMemo(() => getPendingReportsCount(reports), [reports]);
  const resolvedCount = useMemo(() => getResolvedReportsCount(reports), [reports]);
  const recentReports = useMemo(() => getRecentReports(reports, 3), [reports]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';

    const parts = name.trim().split(' ').filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  };

  if (loadingProfile || loadingReports) {
    return (
      <ThemedView style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#2F70E9" />
        <ThemedText style={[styles.loadingText, isDarkMode && styles.darkSubText]}>
          Loading dashboard...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <ThemedText style={[styles.welcomeLabel, isDarkMode && styles.darkSubText]}>
                Welcome back,
              </ThemedText>
              <ThemedText style={[styles.userName, isDarkMode && styles.darkText]}>
                {userProfile?.name || 'User'}
              </ThemedText>
              <ThemedText style={[styles.userBarangay, isDarkMode && styles.darkSubText]}>
                {userProfile?.barangay || 'No barangay set'}
              </ThemedText>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.notificationWrap}>
                <Ionicons
                  name="notifications-outline"
                  size={26}
                  color={isDarkMode ? '#F9FAFB' : '#4B5563'}
                />
                <View style={styles.badgeDot} />
              </View>

              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>{getInitials(userProfile?.name)}</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <View style={styles.statTopRow}>
                <ThemedText style={[styles.statLabel, isDarkMode && styles.darkSubText]}>
                  Pending
                </ThemedText>
                <View style={[styles.statIconWrap, { backgroundColor: '#FFF7ED' }]}>
                  <Ionicons name="time-outline" size={18} color="#F97316" />
                </View>
              </View>
              <ThemedText style={[styles.statValue, isDarkMode && styles.darkText]}>
                {pendingCount}
              </ThemedText>
            </View>

            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <View style={styles.statTopRow}>
                <ThemedText style={[styles.statLabel, isDarkMode && styles.darkSubText]}>
                  Resolved
                </ThemedText>
                <View style={[styles.statIconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#16A34A" />
                </View>
              </View>
              <ThemedText style={[styles.statValue, isDarkMode && styles.darkText]}>
                {resolvedCount}
              </ThemedText>
            </View>
          </View>

          <View style={styles.alertBanner}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning-outline" size={18} color="#FFFFFF" />
              <ThemedText style={styles.alertLabel}>Community Alert</ThemedText>
            </View>
            <ThemedText style={styles.alertTitle}>Heavy Rainfall Warning</ThemedText>
            <ThemedText style={styles.alertDescription}>
              Orange rainfall warning raised in Metro Manila. Expect flooding in low-lying areas.
            </ThemedText>
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              Recent Reports
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(reports_dashboard)/reports.dashboard')}>
              <ThemedText style={styles.viewAll}>View All</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={[styles.sectionSubtext, isDarkMode && styles.darkSubText]}>
            Shows only unresolved reports from the last 3 days.
          </ThemedText>

          {recentReports.length === 0 ? (
            <View style={[styles.emptyCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="document-text-outline" size={24} color="#9CA3AF" />
              <ThemedText style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
                No recent reports
              </ThemedText>
              <ThemedText style={[styles.emptyText, isDarkMode && styles.darkSubText]}>
                Reports disappear here once they are resolved or older than 3 days, but they still remain in Reports Dashboard.
              </ThemedText>
            </View>
          ) : (
            recentReports.map((report) => <RecentReportCard key={report.id} report={report} />)
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => router.push('/category.dashboard')}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={[styles.tabBar, isDarkMode && styles.darkCard]}>
          <TabIcon
            icon="home"
            label="Home"
            active
            onPress={() => router.push('/(home_dasborad)/home.dashboard')}
          />
          <TabIcon
            icon="document-text-outline"
            label="Reports"
            onPress={() => router.push('/(reports_dashboard)/reports.dashboard')}
          />
          <TabIcon
            icon="map-outline"
            label="Maps"
            onPress={() => router.push('/(maps.dashboard)/maps.dashboard')}
          />
          <TabIcon
            icon="bulb-outline"
            label="Ideas"
            onPress={() => router.push('/(ideas_dashboard)/ideas_dashboard')}
          />
          <TabIcon icon="person-outline" label="Profile" onPress={() => router.push('/profile')} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function RecentReportCard({ report }: { report: ReportItem }) {
  const { isDarkMode } = useTheme();
  const statusStyle = getStatusStyle(report.status);

  return (
    <View style={[styles.reportCard, isDarkMode && styles.darkCard]}>
      <View style={styles.reportTopRow}>
        <View style={styles.reportLeftRow}>
          <View style={styles.reportIconWrap}>
            <Ionicons name={getCategoryIcon(report.category) as any} size={22} color="#4B5563" />
          </View>

          <View style={styles.reportTextWrap}>
            <ThemedText style={[styles.reportTitle, isDarkMode && styles.darkText]} numberOfLines={1}>
              {report.title}
            </ThemedText>
            <ThemedText style={[styles.reportCode, isDarkMode && styles.darkSubText]}>
              {report.reportCode}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <ThemedText style={[styles.statusText, { color: statusStyle.color }]}>
            {statusStyle.label}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.reportDescription, isDarkMode && styles.darkSubText]} numberOfLines={2}>
        {report.description}
      </ThemedText>

      <View style={styles.reportFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={14} color="#9CA3AF" />
          <ThemedText style={[styles.footerText, isDarkMode && styles.darkSubText]} numberOfLines={1}>
            {report.location}
          </ThemedText>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <ThemedText style={[styles.footerText, isDarkMode && styles.darkSubText]}>
            {formatTimeAgo(report)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

function TabIcon({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={active ? '#2F70E9' : '#9CA3AF'} />
      <ThemedText style={[styles.tabLabel, { color: active ? '#2F70E9' : '#9CA3AF' }]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  darkCard: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubText: {
    color: '#9CA3AF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  userBarangay: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationWrap: {
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2F70E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    padding: 16,
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  alertBanner: {
    backgroundColor: '#F97316',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  alertLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  alertTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  alertDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.95,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtext: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 13,
    color: '#6B7280',
  },
  viewAll: {
    color: '#2F70E9',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  reportTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  reportLeftRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  reportIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  reportCode: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reportDescription: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 88,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2F70E9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
  },
});