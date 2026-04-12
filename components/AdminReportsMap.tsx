import { Platform } from 'react-native';

const AdminReportsMap =
  Platform.OS === 'web'
    ? require('./AdminReportsMap.web').default
    : require('./AdminReportsMap.native').default;

export default AdminReportsMap;