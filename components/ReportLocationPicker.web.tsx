import { ThemedText } from '@/components/themed-text';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  isDarkMode: boolean;
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
  onLocationChange: (coords: { latitude: number; longitude: number }) => void;
  title: string;
  location: string;
};

const DEFAULT_CENTER: [number, number] = [14.676, 121.0437];

export default function ReportLocationPickerWeb({
  isDarkMode,
  selectedLocation,
  onLocationChange,
}: Props) {
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      const leafletModule = await import('react-leaflet');

      if (!mounted) return;

      setLeaflet({
        MapContainer: leafletModule.MapContainer,
        TileLayer: leafletModule.TileLayer,
        Marker: leafletModule.Marker,
        useMapEvents: leafletModule.useMapEvents,
      });
    };

    loadLeaflet();

    return () => {
      mounted = false;
    };
  }, []);

  if (!leaflet) {
    return (
      <View style={[styles.loadingBox, isDarkMode && styles.darkBox]}>
        <ThemedText style={[styles.loadingText, isDarkMode && styles.darkText]}>
          Loading map...
        </ThemedText>
      </View>
    );
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = leaflet;

  function ClickHandler() {
    useMapEvents({
      click(e: any) {
        onLocationChange({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });

    return null;
  }

  const markerPosition = selectedLocation
    ? ([selectedLocation.latitude, selectedLocation.longitude] as [number, number])
    : null;

  return (
    <View>
      <ThemedText style={[styles.mapHint, isDarkMode && styles.darkSubText]}>
        Click the map to place the exact issue location.
      </ThemedText>

      <View style={styles.mapWrapper}>
        <MapContainer center={DEFAULT_CENTER} zoom={16} style={styles.map as any}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ClickHandler />
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapHint: {
    fontSize: 13,
    marginBottom: 10,
    color: '#6B7280',
  },
  darkSubText: {
    color: '#9CA3AF',
  },
  mapWrapper: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingBox: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  darkBox: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  loadingText: {
    fontSize: 14,
    color: '#111827',
  },
  darkText: {
    color: '#F9FAFB',
  },
});