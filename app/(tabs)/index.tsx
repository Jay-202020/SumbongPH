import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import the router
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter(); // Initialize the router

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Ionicons name="chatbubble-outline" size={40} color="white" />
          </View>
          <ThemedText type="title" style={styles.brandText}>
            Sumbong <ThemedText style={styles.blueText}>PH</ThemedText>
          </ThemedText>
          <ThemedText style={styles.tagline}>
            Your Voice, Your Community's Future.
          </ThemedText>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <FeatureItem 
            icon="chatbubble-ellipses-outline" 
            iconBg="#E8F0FE" 
            iconColor="#2F70E9"
            title="Report Issues" 
            desc="Floods, garbage, roads & more" 
          />
          <FeatureItem 
            icon="pulse-outline" 
            iconBg="#E7F9ED" 
            iconColor="#34C759"
            title="Track Real-time" 
            desc="See status updates instantly" 
          />
          <FeatureItem 
            icon="shield-checkmark-outline" 
            iconBg="#F3E8FF" 
            iconColor="#9333EA"
            title="Verified Action" 
            desc="Direct from barangay officials" 
          />
        </View>

        {/* Buttons Section */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.8}
            onPress={() => router.push('/login')} // Navigates to app/login.tsx
          >
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/login')} // Usually leads to the same sign-in page
          >
            <ThemedText style={styles.linkText}>I already have an account</ThemedText>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
    </ThemedView>
  );
}

// Reusable component for the feature rows
function FeatureItem({ icon, title, desc, iconBg, iconColor }: any) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDesc}>{desc}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#2F70E9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 5,
  },
  brandText: {
    fontSize: 32,
    fontWeight: '800',
  },
  blueText: {
    color: '#2F70E9',
  },
  tagline: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.6,
    fontSize: 16,
  },
  featuresContainer: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
    gap: 15,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
  },
  featureDesc: {
    fontSize: 13,
    opacity: 0.5,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 30,
    alignItems: 'center',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#2F70E9',
    width: '100%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    padding: 10,
  },
  linkText: {
    opacity: 0.6,
    fontSize: 14,
    fontWeight: '500',
  },
});