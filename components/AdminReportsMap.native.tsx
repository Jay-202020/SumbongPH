import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type ReportMapItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
};

type Props = {
  reports: ReportMapItem[];
  selectedReport: ReportMapItem | null;
  onSelectReport: (report: ReportMapItem) => void;
};

export default function AdminReportsMap({
  reports,
  selectedReport,
  onSelectReport,
}: Props) {
  const defaultRegion = selectedReport
    ? {
        latitude: selectedReport.latitude,
        longitude: selectedReport.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : reports.length > 0
    ? {
        latitude: reports[0].latitude,
        longitude: reports[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 14.676,
        longitude: 121.043,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={defaultRegion}>
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            title={report.title}
            description={`${report.category} • ${report.status}`}
            onPress={() => onSelectReport(report)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 560,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 560,
  },
});