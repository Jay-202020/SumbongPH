import { Platform } from 'react-native';

let ReportLocationPicker: any;

if (Platform.OS === 'web') {
  ReportLocationPicker = require('./ReportLocationPicker.web').default;
} else {
  ReportLocationPicker = require('./ReportLocationPicker.native').default;
}

export default ReportLocationPicker;