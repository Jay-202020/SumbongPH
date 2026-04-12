export const REPORT_CATEGORIES = [
  'Flood',
  'Garbage',
  'Road',
  'Streetlight',
  'Noise',
  'Safety',
  'Other',
] as const;

export const REPORT_URGENCY_LEVELS = ['Low', 'Medium', 'High'] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];
export type ReportUrgency = (typeof REPORT_URGENCY_LEVELS)[number];
export type ReportStatus = 'Pending' | 'In Progress' | 'Under Review' | 'Resolved';

export type ReportItem = {
  id: string;
  reportCode: string;
  category: ReportCategory | string;
  title: string;
  description: string;
  location: string;
  urgency: ReportUrgency;
  status: ReportStatus;
  barangay: string;
  userId: string;
  userName: string;
  userEmail: string;
  mobileNumber: string;
  createdAt?: any;
  updatedAt?: any;
};

export type NewReportInput = {
  category: ReportCategory;
  title: string;
  description: string;
  location: string;
  urgency: ReportUrgency;
};