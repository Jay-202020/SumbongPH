import { auth, db } from '@/firebaseConfig';
import { Href } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';

export type AppRole = 'admin' | 'user';

export const getCurrentUserRole = async (): Promise<AppRole> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return 'user';
  }

  const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return 'user';
  }

  const data = snapshot.docs[0].data();
  const rawRole = String(data.role || 'user').toLowerCase().trim();

  return rawRole === 'admin' ? 'admin' : 'user';
};

export const getHomeRouteByRole = (role: AppRole): Href => {
  return role === 'admin'
    ? '/(admin.dashboard)/admin.dashboard'
    : '/(home_dasborad)/home.dashboard';
};

export const getMapsRouteByRole = (role: AppRole): Href => {
  return role === 'admin'
    ? '/(admin.dashboard)/maps.dashboard'
    : '/(maps.dashboard)/maps.dashboard';
};

export const navigateToMapsByRole = async (router: {
  push: (href: Href) => void;
  replace?: (href: Href) => void;
}) => {
  const role = await getCurrentUserRole();
  router.push(getMapsRouteByRole(role));
};