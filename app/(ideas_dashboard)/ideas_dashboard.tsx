import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SuggestionItem } from '@/models/suggestion';
import { fetchSuggestions } from '@/services/suggestionService';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../ThemeContext';

export default function IdeasDashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState<'Popular' | 'Newest'>('Popular');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSuggestions = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await fetchSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.log('FETCH SUGGESTIONS ERROR:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSuggestions();
    }, [])
  );

  const filteredSuggestions = useMemo(() => {
    const data = [...suggestions];

    if (filter === 'Popular') {
      return data.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    }

    return data.sort((a, b) => {
      const aSeconds = a.createdAt?.seconds ?? 0;
      const bSeconds = b.createdAt?.seconds ?? 0;
      return bSeconds - aSeconds;
    });
  }, [suggestions, filter]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          backgroundColor: '#DCFCE7',
          color: '#166534',
        };
      case 'Under Review':
        return {
          backgroundColor: '#FEF9C3',
          color: '#854D0E',
        };
      default:
        return {
          backgroundColor: '#DBEAFE',
          color: '#1D4ED8',
        };
    }
  };

  const formatTimeAgo = (createdAt: any) => {
    try {
      let date: Date;

      if (!createdAt) return 'Just now';

      if (typeof createdAt?.toDate === 'function') {
        date = createdAt.toDate();
      } else if (createdAt?.seconds) {
        date = new Date(createdAt.seconds * 1000);
      } else {
        return 'Just now';
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} min ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#2F70E9" />
        <ThemedText style={[styles.loadingText, isDarkMode && styles.darkSubText]}>
          Loading suggestions...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText style={[styles.headerTitle, isDarkMode && styles.darkText]}>
            Community Suggestions
          </ThemedText>

          <TouchableOpacity
            style={styles.newButton}
            onPress={() => router.push('/new-suggestion')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color="white" />
            <ThemedText style={styles.newButtonText}>New</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[styles.filterContainer, isDarkMode && styles.darkCard]}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'Popular' && styles.activeFilterTab]}
            onPress={() => setFilter('Popular')}
          >
            <ThemedText
              style={[styles.filterText, filter === 'Popular' && styles.activeFilterText]}
            >
              Popular
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'Newest' && styles.activeFilterTab]}
            onPress={() => setFilter('Newest')}
          >
            <ThemedText
              style={[styles.filterText, filter === 'Newest' && styles.activeFilterText]}
            >
              Newest
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadSuggestions(true)}
              tintColor="#2F70E9"
            />
          }
        >
          {filteredSuggestions.length === 0 ? (
            <View style={[styles.emptyCard, isDarkMode && styles.darkCard]}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name="bulb-outline"
                  size={28}
                  color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                />
              </View>
              <ThemedText style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
                No suggestions yet
              </ThemedText>
              <ThemedText style={[styles.emptySubtitle, isDarkMode && styles.darkSubText]}>
                Tap the New button to submit the first community suggestion.
              </ThemedText>
            </View>
          ) : (
            filteredSuggestions.map((item) => (
              <IdeaCard
                key={item.id}
                author={item.userName}
                time={formatTimeAgo(item.createdAt)}
                title={item.title}
                desc={item.description}
                likes={item.likes}
                comments={item.comments}
                status={item.status}
                category={item.category}
                statusStyle={getStatusStyle(item.status)}
              />
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => router.push('/new-suggestion')}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        <View style={[styles.tabBar, isDarkMode && styles.darkCard]}>
          <TabIcon
            icon="home-outline"
            label="Home"
            onPress={() => router.push('/(home_dasborad)/home.dashboard')}
          />
          <TabIcon
  icon="map-outline"
  label="Maps"
  onPress={() => router.push('/(maps.dashboard)/maps.dashboard')}
/>
          
          <TabIcon
            icon="bulb"
            label="Ideas"
            active
            onPress={() => router.push('/(ideas_dashboard)/ideas_dashboard')}
          />
          <TabIcon
            icon="person-outline"
            label="Profile"
            onPress={() => router.push('/profile')}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function IdeaCard({
  author,
  time,
  title,
  desc,
  likes,
  comments,
  status,
  category,
  statusStyle,
}: any) {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.card, isDarkMode && styles.darkCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <ThemedText style={styles.avatarText}>
              {author ? author.charAt(0).toUpperCase() : 'U'}
            </ThemedText>
          </View>

          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.userName, isDarkMode && styles.darkText]}>
              {author || 'User'}
            </ThemedText>
            <ThemedText style={[styles.timeText, isDarkMode && styles.darkSubText]}>
              {time}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <ThemedText style={[styles.statusText, { color: statusStyle.color }]}>
            {status}
          </ThemedText>
        </View>
      </View>

      <View style={styles.categoryBadgeRow}>
        <View style={styles.categoryBadge}>
          <ThemedText style={styles.categoryBadgeText}>{category}</ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.ideaTitle, isDarkMode && styles.darkText]}>
        {title}
      </ThemedText>

      <ThemedText style={[styles.ideaDesc, isDarkMode && styles.darkSubText]}>
        {desc}
      </ThemedText>

      <View style={styles.cardFooter}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="thumbs-up-outline" size={20} color="#6B7280" />
            <ThemedText style={[styles.statText, isDarkMode && styles.darkSubText]}>
              {likes}
            </ThemedText>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
            <ThemedText style={[styles.statText, isDarkMode && styles.darkSubText]}>
              {comments}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.7}>
          <ThemedText style={styles.readMore}>View</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TabIcon({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={{ alignItems: 'center' }} onPress={onPress}>
      <Ionicons name={icon} size={24} color={active ? '#2F70E9' : '#9CA3AF'} />
      <ThemedText
        style={{
          fontSize: 10,
          color: active ? '#2F70E9' : '#9CA3AF',
          marginTop: 4,
          fontWeight: '600',
        }}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  darkContainer: { backgroundColor: '#111827' },
  darkCard: { backgroundColor: '#1F2937', borderColor: '#374151' },
  darkText: { color: '#F9FAFB' },
  darkSubText: { color: '#9CA3AF' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  newButton: {
    backgroundColor: '#2F70E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 4,
  },
  newButtonText: {
    color: 'white',
    fontWeight: '700',
  },

  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeFilterTab: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#111827',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    marginTop: 10,
  },
  emptyIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#2F70E9',
    fontWeight: '700',
  },
  userName: {
    fontWeight: '700',
    color: '#111827',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categoryBadgeRow: {
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  ideaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  ideaDesc: {
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#6B7280',
    fontSize: 14,
  },
  readMore: {
    color: '#2F70E9',
    fontWeight: '600',
  },

  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#2F70E9',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 10,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 20,
  },
});