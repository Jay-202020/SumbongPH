import { db } from '@/firebaseConfig';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';

export const updateReportStatusAndNotify = async (
  reportId: string,
  newStatus: string
) => {
  const reportRef = doc(db, 'reports', reportId);
  const reportSnap = await getDoc(reportRef);

  if (!reportSnap.exists()) {
    throw new Error('Report not found.');
  }

  const reportData = reportSnap.data();
  const userId = reportData.userId;
  const reportTitle = reportData.title || reportData.description || 'Your report';

  if (!userId) {
    throw new Error('Missing userId in report document.');
  }

  await updateDoc(reportRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, 'notifications'), {
    userId,
    reportId,
    title: 'Report Status Updated',
    message: `${reportTitle} is now marked as ${newStatus}.`,
    type: 'report_status',
    status: newStatus,
    read: false,
    createdAt: serverTimestamp(),
  });
};