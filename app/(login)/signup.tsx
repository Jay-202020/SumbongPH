import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router'; // Added Stack here
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');

  const handleSignUp = () => {
    Alert.alert("Success", `Welcome, ${fullName}! Your account has been created.`);
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      {/* 1. This hides the "(signup)/signup" header text */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* 2. Back Button Styled and Functional */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join your community today.</ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Full Name</ThemedText>
                <TextInput 
                  style={styles.input} 
                  placeholder="Juan Dela Cruz"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                />
            </View>

            <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Mobile Number</ThemedText>
                <TextInput 
                  style={styles.input} 
                  placeholder="0912 345 6789"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email Address (Optional)</ThemedText>
                <TextInput 
                  style={styles.input} 
                  placeholder="name@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Barangay</ThemedText>
              <TouchableOpacity style={styles.pickerContainer}>
                <ThemedText style={{ color: '#111827' }}>Select an option</ThemedText>
                <Ionicons name="chevron-down" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Create Account</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Already have an account?{' '}
              <ThemedText 
                style={styles.linkText} 
                onPress={() => router.push('/login')}
              >
                Sign In
              </ThemedText>
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  backButton: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'flex-start',
    marginTop: 10,
  },
  header: { marginTop: 20, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8 },
  form: { gap: 18 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: { 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, // Consistent with login
    padding: 15, 
    fontSize: 16, 
    backgroundColor: '#FFFFFF',
    color: '#111827'
  },
  pickerContainer: { 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, 
    padding: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF' 
  },
  primaryButton: { 
    backgroundColor: '#2F70E9', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: '#2F70E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  footer: { marginTop: 30, marginBottom: 30, alignItems: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  linkText: { color: '#2F70E9', fontWeight: '700' },
});