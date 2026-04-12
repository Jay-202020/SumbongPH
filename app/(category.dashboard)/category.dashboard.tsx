import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../ThemeContext';

const CATEGORIES = [
  { id: '1', label: 'Flood', icon: 'cloud-outline', color: '#EEF2FF', iconColor: '#4F46E5' },
  { id: '2', label: 'Garbage', icon: 'trash-outline', color: '#F0FDF4', iconColor: '#16A34A' },
  { id: '3', label: 'Road', icon: 'construct-outline', color: '#FFF7ED', iconColor: '#EA580C' },
  { id: '4', label: 'Streetlight', icon: 'bulb-outline', color: '#FEFCE8', iconColor: '#CA8A04' },
  { id: '5', label: 'Noise', icon: 'volume-high-outline', color: '#FAF5FF', iconColor: '#9333EA' },
  { id: '6', label: 'Safety', icon: 'alert-circle-outline', color: '#FEF2F2', iconColor: '#DC2626' },
  { id: '7', label: 'Other', icon: 'help-circle-outline', color: '#F9FAFB', iconColor: '#4B5563' },
];

export default function CategoryDashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const renderCategory = ({ item }: { item: (typeof CATEGORIES)[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, isDarkMode && styles.darkCard]}
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: '/edit-report',
          params: { category: item.label },
        })
      }
    >
      <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={28} color={item.iconColor} />
      </View>
      <ThemedText style={[styles.categoryLabel, isDarkMode && styles.darkText]}>
        {item.label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Select Report Type',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
          },
          headerTintColor: isDarkMode ? '#F9FAFB' : '#111827',
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <ThemedText style={[styles.title, isDarkMode && styles.darkText]}>
            What type of issue are you reporting?
          </ThemedText>

          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={renderCategory}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  darkContainer: { backgroundColor: '#111827' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '500',
  },
  darkText: { color: '#F9FAFB' },
  darkCard: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  grid: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
});