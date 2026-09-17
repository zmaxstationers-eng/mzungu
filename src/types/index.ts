export type UserRole = 'teacher' | 'learner' | 'admin';

export type ActivationStatus = 'not_activated' | 'payment_pending' | 'activated' | 'suspended';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  displayName: string;
  avatar: string;
  phoneNumber?: string;
  mpesaNumber?: string;
  country: string;
  nativeLanguage?: string;
  preferredLanguage?: string;
  languagesSpoken: string[];
  kiswahiliLevel: 'Native / Fluent' | 'Advanced' | 'Intermediate' | 'Beginner';
  bio?: string;
  gender?: string;
  ageRange?: string;
  ageConfirmed: boolean;
  activationStatus: ActivationStatus;
  isVerified: boolean;
  isOnline: boolean;
  rating: number;
  totalReviews: number;
  completedHours: number;
  totalSessions: number;
  preferredTopics?: string[];
  availability?: {
    days: string[];
    timeSlots: string[];
    isAvailableToday: boolean;
  };
  learningGoals?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  teacherId: string;
  learnerId: string;
  teacherName: string;
  teacherAvatar: string;
  learnerName: string;
  learnerAvatar: string;
  topic: string;
  status: 'requested' | 'active' | 'completed' | 'cancelled';
  startedAt?: number; // epoch ms
  endedAt?: number; // epoch ms
  verifiedSeconds: number;
  earnedAmount: number; // in KSh (500 per 3600 seconds)
  learnerNotes?: string;
  rating?: number;
  reviewText?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export type TransactionType = 'activation' | 'session_earning' | 'withdrawal' | 'learner_payment' | 'refund';
export type TransactionStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: 'M-Pesa' | 'Platform Balance' | 'Card / Bank';
  reference: string;
  description: string;
  timestamp: number;
}

export interface WithdrawalRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  mpesaNumber: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: number;
  processedAt?: number;
  reference?: string;
  adminNotes?: string;
}

export interface AbuseReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  sessionId?: string;
  reason: 'Harassment' | 'Inappropriate content' | 'Off-platform financial solicitation' | 'Scam / Fraud' | 'Hate speech' | 'Other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: number;
  actionTaken?: string;
}

export interface KiswahiliPhrase {
  id: string;
  swahili: string;
  english: string;
  phonetic: string;
  context: string;
  audioTip?: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: 'Basics' | 'Daily Life' | 'Culture & Slang' | 'Professional';
  description: string;
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  icon: string;
  phrases: KiswahiliPhrase[];
}

export interface TeacherEarningsSummary {
  todaysEarnings: number;
  thisWeeksEarnings: number;
  thisMonthsEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  lifetimeEarnings: number;
}

export interface PlatformStats {
  totalUsers: number;
  activeTeachers: number;
  activeLearners: number;
  sessionsToday: number;
  completedSessions: number;
  teacherEarningsTotal: number;
  platformRevenue: number;
  pendingWithdrawals: number;
  successfulWithdrawals: number;
}

export type AIPersonality = 
  | 'Beginner'
  | 'Curious Traveler'
  | 'Friendly Student'
  | 'Business Learner'
  | 'African Culture Enthusiast'
  | 'Travel Enthusiast'
  | 'Food Lover'
  | 'Sports Fan';

export interface AILearnerProfile {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  nativeLanguage: string;
  kiswahiliLevel: 'Beginner' | 'Elementary' | 'Intermediate' | 'Curious Beginner';
  personality: AIPersonality;
  avatar: string;
  bio: string;
  learningGoal: string;
  interests: string[];
  isOnline: boolean;
  starterMessage: string;
  accentNote?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface AILearningProgress {
  wordsLearned: string[];
  phrasesPracticed: number;
  conversationTimeSeconds: number;
  correctionsCount: number;
  topicsDiscussed: string[];
  currentLevel: 'Beginner' | 'Elementary' | 'Intermediate';
}
