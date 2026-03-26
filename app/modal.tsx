import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">System Notification</ThemedText>
      <ThemedText style={{ marginTop: 10 }}>Your report has been submitted.</ThemedText>
      
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link" style={{ color: '#2F70E9' }}>Return to Dashboard</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});