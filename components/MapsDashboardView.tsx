import { Platform } from 'react-native';

const MapsDashboardView =
  Platform.OS === 'web'
    ? require('./MapsDashboardView.web').default
    : require('./MapsDashboardView.native').default;

export default MapsDashboardView;