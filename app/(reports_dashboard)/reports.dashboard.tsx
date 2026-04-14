import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ReportItem } from '@/models/report';
import {
  fetchReports,
  formatReportDate,
  getCategoryIcon,
  getPendingReportsCount,
  getResolvedReportsCount,
  getStatusStyle,
} from '@/services/reportService';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../ThemeContext';

export default function ReportsDashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Dynamic Theme Colors
  const themeColors = {
    background: isDarkMode ? '#111827' : '#F9FAFB',
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: isDarkMode ? '#374151' : '#E5E7EB',
    text: isDarkMode ? '#F9FAFB' : '#111827',
    subText: isDarkMode ? '#9CA3AF' : '#6B7280',
    primary: '#2F70E9',
    icon: isDarkMode ? '#9CA3AF' : '#4B5563',
  };

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = useCallback(async (useRefresh = false) => {
    try {
      if (useRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await fetchReports();
      setReports(data);
    } catch (error) {
      console.log('REPORTS DASHBOARD LOAD ERROR:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;

    return reports.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.reportCode.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [reports, search]);

  const pendingCount = useMemo(() => getPendingReportsCount(reports), [reports]);
  const resolvedCount = useMemo(() => getResolvedReportsCount(reports), [reports]);

  if (loading) {
    return (
      <ThemedView style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <ThemedText style={[styles.loadingText, { color: themeColors.subText }]}>
          Loading your reports...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={() => loadReports(true)} 
                tintColor={themeColors.primary} // iOS Spinner Color
            />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', borderColor: themeColors.border, borderWidth: 1 }]}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={themeColors.text}
              />
            </TouchableOpacity>

            <View style={styles.headerTextWrap}>
              <ThemedText style={[styles.headerTitle, { color: themeColors.text }]}>
                Reports Dashboard
              </ThemedText>
              <ThemedText style={[styles.headerSubTitle, { color: themeColors.subText }]}>
                This page keeps all of your reports, even old or resolved ones.
              </ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <SummaryCard label="Total" value={reports.length} theme={themeColors} />
            <SummaryCard label="Pending" value={pendingCount} theme={themeColors} />
            <SummaryCard label="Resolved" value={resolvedCount} theme={themeColors} />
          </View>

          <View style={[styles.searchBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Ionicons name="search-outline" size={20} color={themeColors.subText} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Search title, category, status..."
              placeholderTextColor={themeColors.subText}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {filteredReports.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Ionicons name="folder-open-outline" size={32} color={themeColors.subText} />
              <ThemedText style={[styles.emptyTitle, { color: themeColors.text }]}>
                No reports found
              </ThemedText>
              <ThemedText style={[styles.emptyText, { color: themeColors.subText }]}>
                Try another search term or create a new report.
              </ThemedText>
            </View>
          ) : (
            filteredReports.map((report) => <ReportCard key={report.id} report={report} theme={themeColors} />)
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Sub-components for better organization
function SummaryCard({ label, value, theme }: any) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <ThemedText style={[styles.summaryLabel, { color: theme.subText }]}>{label}</ThemedText>
      <ThemedText style={[styles.summaryValue, { color: theme.text }]}>{value}</ThemedText>
    </View>
  );
}

function ReportCard({ report, theme }: { report: ReportItem; theme: any }) {
  const statusStyle = getStatusStyle(report.status);

  return (
    <View style={[styles.reportCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.reportTopRow}>
        <View style={styles.reportMainRow}>
          <View style={[styles.reportIconWrap, { backgroundColor: theme.background }]}>
            <Ionicons name={getCategoryIcon(report.category) as any} size={22} color={theme.icon} />
          </View>

          <View style={styles.reportInfo}>
            <ThemedText style={[styles.reportTitle, { color: theme.text }]} numberOfLines={1}>
              {report.title}
            </ThemedText>
            <ThemedText style={[styles.reportCode, { color: theme.subText }]}>
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

      <ThemedText style={[styles.reportDescription, { color: theme.subText }]} numberOfLines={3}>
        {report.description}
      </ThemedText>

      <View style={styles.metaGrid}>
        <MetaItem icon="grid-outline" label={report.category} theme={theme} />
        <MetaItem icon="location-outline" label={report.location} theme={theme} />
        <MetaItem icon="flash-outline" label={report.urgency} theme={theme} />
        <MetaItem icon="calendar-outline" label={formatReportDate(report)} theme={theme} />
      </View>
    </View>
  );
}

function MetaItem({ icon, label, theme }: any) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color={theme.subText} />
      <ThemedText style={[styles.metaText, { color: theme.subText }]} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60, // Consistent top padding
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '800' },
  headerSubTitle: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    elevation: 1,
  },
  summaryLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 14 },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: '700' },
  emptyText: { marginTop: 8, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  reportCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  reportTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  reportMainRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  reportIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1, marginLeft: 14 },
  reportTitle: { fontSize: 17, fontWeight: '700' },
  reportCode: { fontSize: 12, marginTop: 2 },
  statusBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  reportDescription: { fontSize: 14, lineHeight: 21, marginTop: 14 },
  metaGrid: { marginTop: 16, gap: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { flex: 1, fontSize: 12, fontWeight: '500' },
});