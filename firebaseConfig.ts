import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBDZz0b-ALbKLdgU0LppyJIVYe5oO_q9nM',
  authDomain: 'sumbongph.firebaseapp.com',
  projectId: 'sumbongph',
  storageBucket: 'sumbongph.firebasestorage.app',
  messagingSenderId: '1047234066925',
  appId: '1:1047234066925:web:e61d031a9866ba547d8fe4',
  measurementId: 'G-CBNVT01KN3',
};

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
// This should only be called once.
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  // If auth is already initialized (e.g., during hot reload), get the existing instance.
  authInstance = getAuth(app);
}

export const auth = authInstance;
export { app };
