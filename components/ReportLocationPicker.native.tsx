import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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

const DEFAULT_BARANGAY_REGION = {
  latitude: 14.676,
  longitude: 121.0437,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function ReportLocationPickerNative({
  isDarkMode,
  selectedLocation,
  onLocationChange,
  title,
  location,
}: Props) {
  return (
    <View>
      <ThemedText style={[styles.mapHint, isDarkMode && styles.darkSubText]}>
        Tap the map to place the exact issue location.
      </ThemedText>

      <MapView
        style={styles.map}
        initialRegion={DEFAULT_BARANGAY_REGION}
        onPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;
          onLocationChange({ latitude, longitude });
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={title || 'Reported Issue'}
            description={location || 'Pinned location'}
          />
        )}
      </MapView>
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
  map: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 12,
  },
});