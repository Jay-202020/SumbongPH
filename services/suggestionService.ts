import { auth, db } from '@/firebaseConfig';
import { NewSuggestionInput, SuggestionItem } from '@/models/suggestion';
import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
} from 'firebase/firestore';

type UserProfile = {
  uid: string;
  name: string;
  email: string;
  barangay: string;
  mobileNumber: string;
};

const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('You must be logged in to submit a suggestion.');
  }

  const userQuery = query(
    collection(db, 'users'),
    where('uid', '==', currentUser.uid)
  );

  const userSnapshot = await getDocs(userQuery);

  if (!userSnapshot.empty) {
    const data = userSnapshot.docs[0].data();

    return {
      uid: currentUser.uid,
      name: data.name || 'User',
      email: data.email || currentUser.email || '',
      barangay: data.barangay || '',
      mobileNumber: data.mobileNumber || '',
    };
  }

  return {
    uid: currentUser.uid,
    name: currentUser.displayName || 'User',
    email: currentUser.email || '',
    barangay: '',
    mobileNumber: '',
  };
};

export const submitSuggestion = async (
  input: NewSuggestionInput
): Promise<{ id: string }> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('You must be logged in to submit a suggestion.');
  }

  const profile = await getCurrentUserProfile();

  const docRef = await addDoc(collection(db, 'suggestions'), {
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    status: 'New',
    userId: profile.uid,
    userName: profile.name,
    userEmail: profile.email,
    barangay: profile.barangay,
    mobileNumber: profile.mobileNumber,
    likes: 0,
    comments: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id };
};

export const fetchSuggestions = async (): Promise<SuggestionItem[]> => {
  const snapshot = await getDocs(collection(db, 'suggestions'));

  const suggestions: SuggestionItem[] = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'General',
      status: data.status || 'New',
      userId: data.userId || '',
      userName: data.userName || 'User',
      userEmail: data.userEmail || '',
      barangay: data.barangay || '',
      mobileNumber: data.mobileNumber || '',
      likes: data.likes ?? 0,
      comments: data.comments ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });

  return suggestions.sort((a, b) => {
    const aSeconds = a.createdAt?.seconds ?? 0;
    const bSeconds = b.createdAt?.seconds ?? 0;
    return bSeconds - aSeconds;
  });
};