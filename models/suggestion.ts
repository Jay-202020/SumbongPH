export type SuggestionStatus = 'New' | 'Under Review' | 'Approved';

export type SuggestionItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: SuggestionStatus;
  userId: string;
  userName: string;
  userEmail: string;
  barangay: string;
  mobileNumber: string;
  likes: number;
  comments: number;
  createdAt?: any;
  updatedAt?: any;
};

export type NewSuggestionInput = {
  title: string;
  description: string;
  category: string;
};