import { ThemedText } from '@/components/themed-text';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Props = {
  isDarkMode: boolean;
};

type ReportMapItem = {
  id: string;
  title?: string;
  location?: string;
  category?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const DEFAULT_REGION = {
  latitude: 14.676,
  longitude: 121.0437,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function MapsDashboardViewNative({ isDarkMode }: Props) {
  const [reports, setReports] = useState<ReportMapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'reports'),
      (snapshot) => {
        const data: ReportMapItem[] = snapshot.docs.map((doc) => {
          const raw = doc.data() as any;

          return {
            id: doc.id,
            title: raw.title || 'Untitled Report',
            location: raw.location || 'No location',
            category: raw.category || 'Other',
            latitude: typeof raw.latitude === 'number' ? raw.latitude : null,
            longitude: typeof raw.longitude === 'number' ? raw.longitude : null,
          };
        });

        setReports(data);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  const validReports = useMemo(() => {
    return reports.filter(
      (report) =>
        typeof report.latitude === 'number' &&
        typeof report.longitude === 'number'
    );
  }, [reports]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F70E9" />
        <ThemedText style={[styles.loadingText, isDarkMode && styles.darkSubText]}>
          Loading map reports...
        </ThemedText>
      </View>
    );
  }

  return (
    <MapView style={styles.map} initialRegion={DEFAULT_REGION}>
      {validReports.map((report) => (
        <Marker
          key={report.id}
          coordinate={{
            latitude: report.latitude as number,
            longitude: report.longitude as number,
          }}
          title={report.title || 'Report'}
          description={`${report.category || 'Other'} • ${report.location || 'No location'}`}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  darkSubText: {
    color: '#9CA3AF',
  },
});