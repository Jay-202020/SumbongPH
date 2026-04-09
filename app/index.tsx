import { useRouter } from 'expo-router'; // Import useRouter
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Trigger animations in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      // After the splash screen delay, navigate to the (tabs) group (your landing page).
      // The _layout.tsx will then handle further redirection based on authentication status.
      router.replace('/(tabs)'); 
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Icon Section */}
      <Animated.View 
        style={[
          styles.logoContainer, 
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.iconBox}>
          {/* Replace with your actual chat bubble png/svg */}
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/speech-bubble.png' }} 
            style={styles.icon} 
          />
        </View>
      </Animated.View>

      {/* Text Section */}
      <Animated.View 
        style={[
          styles.textContainer, 
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }
        ]}
      >
        <Text style={styles.title}>
          Sumbong <Text style={styles.blueText}>PH</Text>
        </Text>
        <Text style={styles.subtitle}>
          Your Voice, Your Community’s{"\n"}Future.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  iconBox: {
    width: 100,
    height: 100,
    backgroundColor: '#2563EB', // The blue shade from your image
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  icon: {
    width: 50,
    height: 50,
    tintColor: '#ffffff',
  },
  textContainer: { alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  blueText: { color: '#2563EB' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 10, lineHeight: 22 },
});