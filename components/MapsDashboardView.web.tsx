import { ThemedText } from '@/components/themed-text';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

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

const DEFAULT_CENTER: [number, number] = [14.676, 121.0437];

function getPinColor(category?: string) {
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
      return '#2F70E9';
  }
}

export default function MapsDashboardViewWeb({ isDarkMode }: Props) {
  const [reports, setReports] = useState<ReportMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaflet, setLeaflet] = useState<any>(null);

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

  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      const leafletModule = await import('react-leaflet');
      const L = await import('leaflet');

      if (!mounted) return;

      setLeaflet({
        MapContainer: leafletModule.MapContainer,
        TileLayer: leafletModule.TileLayer,
        Marker: leafletModule.Marker,
        Popup: leafletModule.Popup,
        divIcon: L.divIcon,
      });
    };

    loadLeaflet();

    return () => {
      mounted = false;
    };
  }, []);

  const validReports = useMemo(() => {
    return reports.filter(
      (report) =>
        typeof report.latitude === 'number' &&
        typeof report.longitude === 'number'
    );
  }, [reports]);

  if (loading || !leaflet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F70E9" />
        <ThemedText style={[styles.loadingText, isDarkMode && styles.darkSubText]}>
          Loading map reports...
        </ThemedText>
      </View>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, divIcon } = leaflet;
  const WebMapContainer: any = MapContainer;
  const WebTileLayer: any = TileLayer;
  const WebMarker: any = Marker;
  const WebPopup: any = Popup;

  const createCategoryIcon = (category?: string) => {
    const color = getPinColor(category);

    return divIcon({
      className: '',
      html: `
        <div style="
          position: relative;
          width: 22px;
          height: 22px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        ">
          <div style="
            position: absolute;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            top: 4px;
            left: 4px;
          "></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 22],
      popupAnchor: [0, -20],
    });
  };

  return (
    <View style={styles.mapWrapper}>
      <WebMapContainer center={DEFAULT_CENTER} zoom={16} style={styles.map}>
        <WebTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {validReports.map((report) => (
          <WebMarker
            key={report.id}
            position={[report.latitude as number, report.longitude as number]}
            icon={createCategoryIcon(report.category)}
          >
            <WebPopup>
              <div style={{ minWidth: 150 }}>
                <strong>{report.title || 'Report'}</strong>
                <br />
                <span>{report.category || 'Other'}</span>
                <br />
                <small>{report.location || 'No location'}</small>
              </div>
            </WebPopup>
          </WebMarker>
        ))}
      </WebMapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  } as any,
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