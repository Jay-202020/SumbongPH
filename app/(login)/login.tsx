import { auth } from '@/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Login Failed', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(home_dasborad)/home.dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#111827" />
          </TouchableOpacity>

          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to continue reporting issues.</ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="admin@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity style={styles.forgotPassword}>
                <ThemedText style={styles.blueLinkText}>Forgot Password?</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={loading}>
              <ThemedText style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Don't have an account?{' '}
              <ThemedText style={styles.linkText} onPress={() => router.push('/signup')}>Sign Up</ThemedText>
            </ThemedText>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  backButton: { marginTop: 10, width: 40, height: 40, justifyContent: 'center' },
  header: { marginTop: 20, marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, backgroundColor: '#FFFFFF' },
  forgotPassword: { alignSelf: 'flex-end' },
  signInButton: { backgroundColor: '#2F70E9', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  blueLinkText: { color: '#2F70E9', fontSize: 14 },
  linkText: { color: '#2F70E9', fontWeight: '700' },
  footer: { marginTop: 'auto', marginBottom: 30, alignItems: 'center' },
  footerText: { color: '#6B7280' },
});