import { auth, db } from '@/firebaseConfig';
import { SuggestionItem } from '@/models/suggestion';
import { fetchSuggestions } from '@/services/suggestionService';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

export default function AdminIdeasDashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for Filters
  const [sortBy, setSortBy] = useState<'Latest' | 'Trending'>('Latest');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAdminAccess = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.replace('/(login)/login');
          return;
        }

        const adminRef = doc(db, 'admin', user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
          router.replace('/(home_dasborad)/home.dashboard');
          return;
        }

        const adminData = adminSnap.data();
        if (adminData.active !== true) {
          await signOut(auth);
          Alert.alert('Access Denied', 'This admin account is inactive.');
          router.replace('/(login)/login');
          return;
        }

        setAdminName(adminData.name || 'Admin');
      } catch (error) {
        console.log('ADMIN ACCESS ERROR:', error);
        router.replace('/(login)/login');
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAdminAccess();
  }, [isMounted, router]);

  const loadSuggestions = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      const data = await fetchSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error('ADMIN FETCH ERROR:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isMounted) loadSuggestions();
    }, [isMounted])
  );

  // Logic for Approval Filter and Sorting
  const processedData = useMemo(() => {
    let result = suggestions.filter(item => {
      if (statusFilter === 'approved') {
        return item.status === 'approved';
      } else {
        return item.status !== 'approved'; // Includes 'pending' or undefined
      }
    });

    if (sortBy === 'Latest') {
      result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } else if (sortBy === 'Trending') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return result;
  }, [suggestions, sortBy, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const ideaRef = doc(db, 'suggestions', id);
      await updateDoc(ideaRef, { status: newStatus });
      loadSuggestions();
    } catch (error) {
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(login)/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  if (!isMounted || checkingAccess) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Checking admin access...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.logo}>SumbongPH</Text>
        {isDesktop && (
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/admin.dashboard')}>
              <Text style={styles.navItem}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/complaints.dashboard')}>
              <Text style={styles.navItem}>Complaints</Text>
            </TouchableOpacity>
            <View style={styles.activeTabWrapper}>
              <Text style={styles.activeNavItem}>Ideas</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/maps.dashboard')}>
              <Text style={styles.navItem}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(admin.dashboard)/users.dashboard')}>
              <Text style={styles.navItem}>Users</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.userName}>Logout • {adminName}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={isDesktop ? styles.desktopPadding : styles.mobilePadding}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadSuggestions(true)} tintColor="#F97316" />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.mainTitle}>Community Ideas</Text>
            <Text style={styles.subtitle}>Reviewing suggestions for geospatial improvements.</Text>
          </View>
          
          <View style={styles.controlsRow}>
            {/* Status Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setStatusFilter('pending')} style={[styles.tabBtn, statusFilter === 'pending' && styles.tabBtnActive]}>
                <Text style={[styles.tabBtnText, statusFilter === 'pending' && styles.tabBtnTextActive]}>In Review</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStatusFilter('approved')} style={[styles.tabBtn, statusFilter === 'approved' && styles.tabBtnActive]}>
                <Text style={[styles.tabBtnText, statusFilter === 'approved' && styles.tabBtnTextActive]}>Approved</Text>
              </TouchableOpacity>
            </View>

            {/* Sort Filter */}
            <View style={styles.sortContainer}>
              <TouchableOpacity onPress={() => setSortBy('Latest')} style={[styles.sortBtn, sortBy === 'Latest' && styles.sortBtnActive]}>
                <Text style={[styles.sortBtnText, sortBy === 'Latest' && styles.sortBtnTextActive]}>Latest</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSortBy('Trending')} style={[styles.sortBtn, sortBy === 'Trending' && styles.sortBtnActive]}>
                <Text style={[styles.sortBtnText, sortBy === 'Trending' && styles.sortBtnTextActive]}>Trending</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.cardsGrid}>
          {loading ? (
            <ActivityIndicator size="large" color="#F97316" />
          ) : (
            processedData.map((item) => (
              <AdminIdeaCard 
                key={item.id} 
                item={item} 
                isDesktop={isDesktop} 
                onUpdateStatus={handleUpdateStatus}
                adminName={adminName}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-Component with working Comment/Reply System
const AdminIdeaCard = ({ item, isDesktop, onUpdateStatus, adminName }: any) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);

  useEffect(() => {
    if (!showComments) return;
    const q = query(collection(db, 'suggestions', item.id, 'comments'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [showComments, item.id]);

  const handlePostComment = async () => {
    if (!inputText.trim()) return;
    try {
      await addDoc(collection(db, 'suggestions', item.id, 'comments'), {
        text: replyTo ? `@${replyTo.name} ${inputText}` : inputText,
        authorName: adminName,
        isAdmin: true,
        createdAt: serverTimestamp()
      });
      setInputText('');
      setReplyTo(null);
    } catch (e) {
      Alert.alert('Error', 'Failed to send reply');
    }
  };

  return (
    <View style={[styles.card, isDesktop ? styles.cardDesktop : styles.cardMobile]}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'approved' ? '#DCFCE7' : '#FEF9C3' }]}>
            <Text style={[styles.statusText, { color: item.status === 'approved' ? '#166534' : '#854D0E' }]}>
                {item.status?.toUpperCase() || 'REVIEW'}
            </Text>
        </View>
        <View style={styles.likesBadge}><Ionicons name="heart" size={14} color="#EF4444" /><Text style={styles.likesText}>{item.likes || 0}</Text></View>
      </View>
      
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={showComments ? undefined : 3}>{item.description}</Text>

      {/* Admin Quick Actions */}
      <View style={styles.adminActionRow}>
        <TouchableOpacity 
            style={item.status === 'approved' ? styles.reviewBtn : styles.approveBtn} 
            onPress={() => onUpdateStatus(item.id, item.status === 'approved' ? 'pending' : 'approved')}
        >
            <Text style={item.status === 'approved' ? styles.reviewBtnText : styles.approveBtnText}>
                {item.status === 'approved' ? 'Move to Review' : 'Approve Post'}
            </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.commentToggle} onPress={() => setShowComments(!showComments)}>
            <Ionicons name="chatbubble-outline" size={18} color="#4B5563" />
            <Text style={styles.commentToggleText}>Comments</Text>
        </TouchableOpacity>
      </View>
      
      {showComments && (
          <View style={styles.commentSection}>
              {comments.map((c) => (
                  <View key={c.id} style={[styles.commentBubble, c.isAdmin && styles.adminBubble]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.commentAuthor}>{c.authorName} {c.isAdmin && '(Admin)'}</Text>
                        {!c.isAdmin && (
                            <TouchableOpacity onPress={() => setReplyTo({ id: c.id, name: c.authorName })}>
                                <Text style={styles.replyActionText}>Reply</Text>
                            </TouchableOpacity>
                        )}
                      </View>
                      <Text style={styles.commentText}>{c.text}</Text>
                  </View>
              ))}
              
              <View style={styles.replyInputContainer}>
                {replyTo && (
                  <TouchableOpacity onPress={() => setReplyTo(null)} style={styles.replyChip}>
                    <Text style={styles.replyChipText}>@{replyTo.name} x</Text>
                  </TouchableOpacity>
                )}
                <TextInput 
                  style={styles.replyInput} 
                  placeholder="Post a reply..." 
                  value={inputText} 
                  onChangeText={setInputText} 
                />
                <TouchableOpacity onPress={handlePostComment}><Ionicons name="send" size={20} color="#F97316" /></TouchableOpacity>
              </View>
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  desktopPadding: { paddingHorizontal: 60, paddingBottom: 40 },
  mobilePadding: { paddingHorizontal: 16, paddingBottom: 20 },
  loadingContainer: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666', fontWeight: '500' },
  navBar: { height: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: 'white' },
  logo: { fontSize: 22, fontWeight: '900', color: '#111827' },
  navLinks: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navItem: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  activeTabWrapper: { borderBottomWidth: 2, borderBottomColor: '#F97316', paddingVertical: 24 },
  activeNavItem: { fontSize: 14, fontWeight: '700', color: '#F97316' },
  userName: { fontSize: 13, fontWeight: '600', color: '#374151' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 32, marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  controlsRow: { flexDirection: 'row', gap: 12 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 4, borderRadius: 10 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#111827' },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabBtnTextActive: { color: 'white' },
  sortContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 4, borderRadius: 10 },
  sortBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  sortBtnActive: { backgroundColor: 'white', elevation: 1 },
  sortBtnText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  sortBtnTextActive: { color: '#111827' },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 10 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  cardDesktop: { width: '31%' },
  cardMobile: { width: '100%' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
  likesBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  likesText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  cardDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 16 },
  adminActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16, marginBottom: 12 },
  approveBtn: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  approveBtnText: { color: 'white', fontSize: 12, fontWeight: '700' },
  reviewBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  reviewBtnText: { color: '#4B5563', fontSize: 12, fontWeight: '700' },
  commentToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commentToggleText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  commentSection: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginTop: 10 },
  commentBubble: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  adminBubble: { borderColor: '#F97316', backgroundColor: '#FFF7ED' },
  commentAuthor: { fontSize: 11, fontWeight: '800', color: '#111827', marginBottom: 2 },
  replyActionText: { fontSize: 11, color: '#F97316', fontWeight: '800' },
  commentText: { fontSize: 13, color: '#374151', lineHeight: 18 },
  replyInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB', marginTop: 8 },
  replyInput: { flex: 1, height: 40, fontSize: 13 },
  replyChip: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  replyChipText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
});