import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent data store
interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: 'teacher' | 'learner' | 'admin';
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
  activationStatus: 'not_activated' | 'payment_pending' | 'activated' | 'suspended';
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
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  createdAt: string;
}

interface StoredSession {
  id: string;
  teacherId: string;
  learnerId: string;
  teacherName: string;
  teacherAvatar: string;
  learnerName: string;
  learnerAvatar: string;
  topic: string;
  status: 'requested' | 'active' | 'completed' | 'cancelled';
  startedAt?: number;
  endedAt?: number;
  verifiedSeconds: number;
  earnedAmount: number;
  learnerNotes?: string;
  rating?: number;
  reviewText?: string;
  createdAt: number;
}

interface StoredMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'learner' | 'admin';
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

interface StoredTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'activation' | 'session_earning' | 'withdrawal' | 'learner_payment' | 'refund';
  status: 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: 'M-Pesa' | 'Platform Balance' | 'Card / Bank';
  reference: string;
  description: string;
  timestamp: number;
}

interface StoredWithdrawal {
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

interface StoredReport {
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

// Password hashing utility
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'FMZ_SALT_2026').digest('hex');
}

// Initial Seed Data
const users: StoredUser[] = [
  {
    id: 'user_admin_1',
    email: 'admin@funzamzungu.com',
    passwordHash: hashPassword('admin123'),
    role: 'admin',
    fullName: 'David Kiprono',
    displayName: 'David (Admin Desk)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    phoneNumber: '+254712000001',
    country: 'Kenya',
    languagesSpoken: ['Kiswahili', 'English'],
    kiswahiliLevel: 'Native / Fluent',
    ageConfirmed: true,
    activationStatus: 'activated',
    isVerified: true,
    isOnline: true,
    rating: 5.0,
    totalReviews: 0,
    completedHours: 0,
    totalSessions: 0,
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user_teacher_1',
    email: 'amani@funzamzungu.com',
    passwordHash: hashPassword('teacher123'),
    role: 'teacher',
    fullName: 'Amani Wanjiku Mwangi',
    displayName: 'Amani W.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    phoneNumber: '+254712345678',
    mpesaNumber: '0712345678',
    country: 'Kenya',
    nativeLanguage: 'Kiswahili',
    preferredLanguage: 'English',
    languagesSpoken: ['Kiswahili', 'English', 'French (Basic)'],
    kiswahiliLevel: 'Native / Fluent',
    bio: 'Habari! I am a passionate Kiswahili host from Nairobi with 3+ years of tutoring foreigners. I love teaching everyday Kenyan Sheng, greetings, and market bargaining skills. Patient, fun, and culturally rich conversations!',
    gender: 'Female',
    ageRange: '25-34',
    ageConfirmed: true,
    activationStatus: 'activated',
    isVerified: true,
    isOnline: true,
    rating: 4.95,
    totalReviews: 48,
    completedHours: 64,
    totalSessions: 52,
    preferredTopics: ['Greetings & Polite Expressions', 'Nairobi Market & Shopping', 'Kenyan Slang (Sheng)', 'Pronunciation'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['Morning (9am - 12pm)', 'Afternoon (2pm - 6pm)', 'Evening (7pm - 10pm)'],
      isAvailableToday: true,
    },
    availableBalance: 3250,
    pendingBalance: 500,
    totalWithdrawn: 14500,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user_teacher_2',
    email: 'baraka@funzamzungu.com',
    passwordHash: hashPassword('teacher123'),
    role: 'teacher',
    fullName: 'Baraka Juma Omar',
    displayName: 'Baraka J.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    phoneNumber: '+254722987654',
    mpesaNumber: '0722987654',
    country: 'Kenya',
    nativeLanguage: 'Kiswahili',
    preferredLanguage: 'English',
    languagesSpoken: ['Kiswahili (Sanifu)', 'English', 'Arabic'],
    kiswahiliLevel: 'Native / Fluent',
    bio: 'Born in Mombasa, I speak pristine Kiswahili Sanifu (Coastal Swahili). Specialized in grammar clarity, business Kiswahili, and coastal cultural etiquette. Karibu tujifunze pamoja!',
    gender: 'Male',
    ageRange: '25-34',
    ageConfirmed: true,
    activationStatus: 'activated',
    isVerified: true,
    isOnline: true,
    rating: 4.9,
    totalReviews: 32,
    completedHours: 42,
    totalSessions: 38,
    preferredTopics: ['Pristine Coastal Swahili', 'Grammar & Verb Conjugation', 'Business Kiswahili', 'Travel & Safari Phrases'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      timeSlots: ['Afternoon (1pm - 5pm)', 'Night (8pm - 11pm)'],
      isAvailableToday: true,
    },
    availableBalance: 1500,
    pendingBalance: 0,
    totalWithdrawn: 8000,
    createdAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 'user_teacher_3',
    email: 'zawadi@funzamzungu.com',
    passwordHash: hashPassword('teacher123'),
    role: 'teacher',
    fullName: 'Zawadi Chebet',
    displayName: 'Zawadi C.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    phoneNumber: '+254733112233',
    mpesaNumber: '0733112233',
    country: 'Kenya',
    nativeLanguage: 'Kiswahili',
    languagesSpoken: ['Kiswahili', 'English'],
    kiswahiliLevel: 'Native / Fluent',
    bio: 'High school Swahili instructor helping beginner expats and travelers build rapid confidence. We focus on natural speech rhythms and zero anxiety.',
    gender: 'Female',
    ageRange: '35-44',
    ageConfirmed: true,
    activationStatus: 'payment_pending',
    isVerified: false,
    isOnline: false,
    rating: 5.0,
    totalReviews: 0,
    completedHours: 0,
    totalSessions: 0,
    preferredTopics: ['Beginner Fundamentals', 'Introductions & Family', 'Food & Dining Out'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlots: ['Morning (8am - 11am)'],
      isAvailableToday: false,
    },
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    createdAt: '2026-03-01T09:15:00Z',
  },
  {
    id: 'user_learner_1',
    email: 'sarah@example.com',
    passwordHash: hashPassword('learner123'),
    role: 'learner',
    fullName: 'Sarah Jenkins',
    displayName: 'Sarah (UK)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    nativeLanguage: 'English',
    languagesSpoken: ['English'],
    kiswahiliLevel: 'Beginner',
    ageConfirmed: true,
    activationStatus: 'activated',
    isVerified: true,
    isOnline: true,
    rating: 5.0,
    totalReviews: 5,
    completedHours: 8,
    totalSessions: 7,
    learningGoals: 'Moving to Nairobi for a 6-month NGO project. Want to navigate Matatus, greet elders respectfully, and chat with local colleagues.',
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'user_learner_2',
    email: 'david@example.com',
    passwordHash: hashPassword('learner123'),
    role: 'learner',
    fullName: 'David Miller',
    displayName: 'David (USA)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    country: 'United States',
    nativeLanguage: 'English',
    languagesSpoken: ['English', 'Spanish'],
    kiswahiliLevel: 'Intermediate',
    ageConfirmed: true,
    activationStatus: 'activated',
    isVerified: true,
    isOnline: false,
    rating: 4.8,
    totalReviews: 3,
    completedHours: 12,
    totalSessions: 9,
    learningGoals: 'Planning wildlife safari in Masai Mara and Serengeti. Want to understand deep conversational East African culture.',
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    createdAt: '2026-02-20T16:20:00Z',
  }
];

const sessions: StoredSession[] = [
  {
    id: 'session_demo_active',
    teacherId: 'user_teacher_1',
    learnerId: 'user_learner_1',
    teacherName: 'Amani W.',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    learnerName: 'Sarah (UK)',
    learnerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    topic: 'Nairobi Market & Shopping (Kununua Sokoni)',
    status: 'active',
    startedAt: Date.now() - (42 * 60 * 1000 + 18 * 1000), // 42 mins 18 secs ago
    verifiedSeconds: 2538,
    earnedAmount: 352.5,
    learnerNotes: 'Practicing how to ask for prices and bargain respectfully.',
    createdAt: Date.now() - (45 * 60 * 1000),
  },
  {
    id: 'session_demo_prev1',
    teacherId: 'user_teacher_1',
    learnerId: 'user_learner_1',
    teacherName: 'Amani W.',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    learnerName: 'Sarah (UK)',
    learnerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    topic: 'Greetings & Polite Introductions (Salamu na Kujitambulisha)',
    status: 'completed',
    startedAt: Date.now() - 86400000 * 2 - 3600000,
    endedAt: Date.now() - 86400000 * 2,
    verifiedSeconds: 3600,
    earnedAmount: 500,
    learnerNotes: 'Mastered "Jambo", "Habari gani", and respectful replies!',
    rating: 5,
    reviewText: 'Amani was exceptionally friendly and taught me real phrases people in Nairobi actually say!',
    createdAt: Date.now() - 86400000 * 2 - 3700000,
  }
];

const messages: StoredMessage[] = [
  {
    id: 'msg_1',
    sessionId: 'session_demo_active',
    senderId: 'system',
    senderName: 'System',
    senderRole: 'admin',
    text: 'Session connected! Verified timer running at rate of KSh 500/hr. Remember to keep all conversations polite, educational, and respectful of community safety rules.',
    timestamp: Date.now() - (42 * 60 * 1000),
    isSystem: true,
  },
  {
    id: 'msg_2',
    sessionId: 'session_demo_active',
    senderId: 'user_teacher_1',
    senderName: 'Amani W.',
    senderRole: 'teacher',
    text: 'Jambo Sarah! Habari yako ya leo? (How are you today?)',
    timestamp: Date.now() - (41 * 60 * 1000),
  },
  {
    id: 'msg_3',
    sessionId: 'session_demo_active',
    senderId: 'user_learner_1',
    senderName: 'Sarah (UK)',
    senderRole: 'learner',
    text: 'Nzuri sana, Amani! Mimi niko poa! 😊 Today I want to learn how to buy fruits at City Market.',
    timestamp: Date.now() - (40 * 60 * 1000),
  },
  {
    id: 'msg_4',
    sessionId: 'session_demo_active',
    senderId: 'user_teacher_1',
    senderName: 'Amani W.',
    senderRole: 'teacher',
    text: 'Safi kabisa! In Nairobi markets, when you approach a fruit seller (mchuuzi), you say:\n"Hujambo! Embe hili ni bei gani?" (Hello! How much is this mango?)\nTry saying that!',
    timestamp: Date.now() - (38 * 60 * 1000),
  },
  {
    id: 'msg_5',
    sessionId: 'session_demo_active',
    senderId: 'user_learner_1',
    senderName: 'Sarah (UK)',
    senderRole: 'learner',
    text: '"Hujambo! Embe hili ni bei gani?" And if they say 100 shillings, how do I ask for a polite discount without sounding rude?',
    timestamp: Date.now() - (35 * 60 * 1000),
  },
  {
    id: 'msg_6',
    sessionId: 'session_demo_active',
    senderId: 'user_teacher_1',
    senderName: 'Amani W.',
    senderRole: 'teacher',
    text: 'You say with a warm smile:\n"Punguza kidogo tafadhali, nitaongeza parachichi." (Reduce a little bit please, and I will add avocado.)\nKenyans love that friendly negotiation! 🥑',
    timestamp: Date.now() - (33 * 60 * 1000),
  }
];

const transactions: StoredTransaction[] = [
  {
    id: 'txn_act_01',
    userId: 'user_teacher_1',
    userName: 'Amani W.',
    amount: 600,
    type: 'activation',
    status: 'successful',
    paymentMethod: 'M-Pesa',
    reference: 'QA7489X19K',
    description: 'Teacher Account Activation Fee (KSh 600) via M-Pesa Paybill 174379',
    timestamp: Date.now() - 86400000 * 30,
  },
  {
    id: 'txn_earn_01',
    userId: 'user_teacher_1',
    userName: 'Amani W.',
    amount: 500,
    type: 'session_earning',
    status: 'successful',
    paymentMethod: 'Platform Balance',
    reference: 'SES-882190',
    description: 'Verified Teaching Earnings: 60 mins conversation with Sarah (UK) at KSh 500/hr',
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'txn_wth_01',
    userId: 'user_teacher_1',
    userName: 'Amani W.',
    amount: 3000,
    type: 'withdrawal',
    status: 'successful',
    paymentMethod: 'M-Pesa',
    reference: 'QB9104M28C',
    description: 'M-Pesa B2C Payout to 0712345678 (Net KSh 2,985, Fee KSh 15)',
    timestamp: Date.now() - 86400000 * 5,
  }
];

const withdrawals: StoredWithdrawal[] = [
  {
    id: 'wth_001',
    teacherId: 'user_teacher_1',
    teacherName: 'Amani W.',
    mpesaNumber: '0712345678',
    amount: 3000,
    fee: 15,
    netAmount: 2985,
    status: 'completed',
    requestedAt: Date.now() - 86400000 * 5,
    processedAt: Date.now() - 86400000 * 5 + 3600000,
    reference: 'QB9104M28C',
    adminNotes: 'Automated M-Pesa B2C disbursement verified.',
  },
  {
    id: 'wth_002',
    teacherId: 'user_teacher_1',
    teacherName: 'Amani W.',
    mpesaNumber: '0712345678',
    amount: 500,
    fee: 15,
    netAmount: 485,
    status: 'pending',
    requestedAt: Date.now() - 3600000 * 3,
    reference: 'REQ-99021',
    adminNotes: 'Awaiting manual daily batch approval review.',
  }
];

const reports: StoredReport[] = [
  {
    id: 'rep_001',
    reporterId: 'user_learner_2',
    reporterName: 'David (USA)',
    reportedUserId: 'guest_spammer_9',
    reportedUserName: 'Spam_Guest_88',
    reason: 'Off-platform financial solicitation',
    details: 'User messaged asking to transfer money via private crypto address instead of platform learning session.',
    status: 'resolved',
    createdAt: Date.now() - 86400000 * 4,
    actionTaken: 'Account permanently suspended and IP blocked.',
  }
];

const announcements = [
  {
    id: 'ann_1',
    title: 'Karibu Funza Mzungu! New Audio Pronunciation Guides Added',
    message: 'We have updated our Kiswahili topic library with phonetics and sound bites for Sheng and Coastal Swahili.',
    date: '2026-03-10',
    priority: 'info'
  },
  {
    id: 'ann_2',
    title: 'Verified Teacher Activation & Payout Schedule',
    message: 'Teacher M-Pesa disbursements are processed twice daily at 11:00 AM and 6:00 PM EAT. Minimum withdrawal is KSh 500.',
    date: '2026-03-14',
    priority: 'important'
  }
];

const learningTopics = [
  {
    id: 'topic_greetings',
    title: 'Greetings & Respectful Introductions',
    category: 'Basics',
    description: 'Essential polite openers for interacting with elders, peers, and new friends in Kenya.',
    level: 'Beginner',
    icon: 'Handshake',
    phrases: [
      { id: 'p1', swahili: 'Habari yako?', english: 'How are you?', phonetic: 'ha-BAH-ree YAH-koh', context: 'Standard respectful greeting suitable for all adults.' },
      { id: 'p2', swahili: 'Nzuri sana, asante.', english: 'Very fine, thank you.', phonetic: 'n-ZOO-ree SAH-nah, ah-SAHN-teh', context: 'Standard positive reply to Habari.' },
      { id: 'p3', swahili: 'Shikamoo', english: 'My respectful greetings (to elders)', phonetic: 'shee-kah-MOH', context: 'Said strictly to older people or respected figures as deep courtesy.' },
      { id: 'p4', swahili: 'Marahaba', english: 'I accept your respect', phonetic: 'mah-rah-HAH-bah', context: 'The only correct response an elder gives to Shikamoo.' },
      { id: 'p5', swahili: 'Jina lako ni nani?', english: 'What is your name?', phonetic: 'JEE-nah LAH-koh nee NAH-nee', context: 'Polite inquiry into someone’s name.' },
      { id: 'p6', swahili: 'Jina langu ni...', english: 'My name is...', phonetic: 'JEE-nah LAHN-goo nee...', context: 'Introducing yourself.' }
    ]
  },
  {
    id: 'topic_shopping',
    title: 'Nairobi Market & Shopping',
    category: 'Daily Life',
    description: 'How to purchase fruits, clothes, souvenirs (vinyago), and bargain respectfully.',
    level: 'Beginner',
    icon: 'ShoppingBag',
    phrases: [
      { id: 'p7', swahili: 'Hii ni bei gani?', english: 'How much is this?', phonetic: 'HEE nee BAY GAH-nee', context: 'Essential question when pricing any item.' },
      { id: 'p8', swahili: 'Punguza bei kidogo tafadhali.', english: 'Please reduce the price a little.', phonetic: 'poon-GOO-zah BAY kee-DOH-goh tah-fah-DHAH-lee', context: 'Polite way to start negotiations without offense.' },
      { id: 'p9', swahili: 'Bei ya mwisho ni ngapi?', english: 'What is your final price?', phonetic: 'BAY yah MWEE-shoh nee NGAH-pee', context: 'Closing a deal in Gikomba or City Market.' },
      { id: 'p10', swahili: 'Naweza kulipa na M-Pesa?', english: 'Can I pay with M-Pesa?', phonetic: 'nah-WEH-zah koo-LEE-pah nah M-PEH-sah', context: 'Accepted almost everywhere across Kenya.' }
    ]
  },
  {
    id: 'topic_sheng',
    title: 'Kenyan Youth Slang (Sheng) & Nairobi Life',
    category: 'Culture & Slang',
    description: 'Understand vibrant Nairobi street vocabulary, matatu terms, and friendly vibes.',
    level: 'Intermediate',
    icon: 'Sparkles',
    phrases: [
      { id: 'p11', swahili: 'Sasa? / Vipi?', english: 'What’s up? / How’s it?', phonetic: 'SAH-sah / VEE-pee', context: 'Casual greeting among friends and peers.' },
      { id: 'p12', swahili: 'Niko fiti / Niko poa', english: 'I am doing great / cool', phonetic: 'NEE-koh FEE-tee / NEE-koh POH-ah', context: 'Common cool reply in Nairobi.' },
      { id: 'p13', swahili: 'Manze, leo kumenoga!', english: 'Man, today is vibrant/exciting!', phonetic: 'MAHN-zeh, LEH-oh koo-meh-NOH-gah', context: 'Used to express enthusiasm about a good day or event.' },
      { id: 'p14', swahili: 'Shukran sana kaka/dada', english: 'Thank you very much brother/sister', phonetic: 'shoo-KRAHN SAH-nah KAH-kah/DAH-dah', context: 'Warm street thank you.' }
    ]
  },
  {
    id: 'topic_travel',
    title: 'Travel, Safari & Transport (Matatu & Taxi)',
    category: 'Daily Life',
    description: 'Navigating Kenya, catching a matatu, visiting national parks, and asking directions.',
    level: 'Beginner',
    icon: 'Compass',
    phrases: [
      { id: 'p15', swahili: 'Nishushe hapa tafadhali.', english: 'Please drop me off here.', phonetic: 'nee-SHOO-sheh HAH-pah tah-fah-DHAH-lee', context: 'Crucial phrase when riding in a Matatu or taxi.' },
      { id: 'p16', swahili: 'Safari hii inachukua muda gani?', english: 'How long does this journey take?', phonetic: 'sah-FAH-ree HEE ee-nah-choo-KOO-ah MOO-dah GAH-nee', context: 'Checking travel duration.' },
      { id: 'p17', swahili: 'Hoteli iko wapi?', english: 'Where is the hotel?', phonetic: 'hoh-TEH-lee EE-koh WAH-pee', context: 'Finding your accommodation.' },
      { id: 'p18', swahili: 'Wanyama wa porini wanavutia sana.', english: 'The wild animals are fascinating.', phonetic: 'wah-NYAH-mah wah poh-REE-nee wah-nah-voo-TEE-ah SAH-nah', context: 'Discussing game drives and safaris.' }
    ]
  },
  {
    id: 'topic_food',
    title: 'Food, Dining & Swahili Delicacies',
    category: 'Daily Life',
    description: 'Ordering Nyama Choma, Chapati, Sukuma Wiki, Ugali, and Pilau.',
    level: 'Beginner',
    icon: 'UtensilsCrossed',
    phrases: [
      { id: 'p19', swahili: 'Chakula kitamu sana!', english: 'The food is very delicious!', phonetic: 'chah-KOO-lah kee-TAH-moo SAH-nah', context: 'Complimenting the cook or waiter.' },
      { id: 'p20', swahili: 'Lete bili tafadhali.', english: 'Bring the bill please.', phonetic: 'LEH-teh BEE-lee tah-fah-DHAH-lee', context: 'Paying for your meal.' },
      { id: 'p21', swahili: 'Nipatie maji baridi / ya moto.', english: 'Give me cold water / warm water.', phonetic: 'nee-pah-TEE-eh MAH-jee bah-REE-dee', context: 'Beverage requests.' }
    ]
  },
  {
    id: 'topic_business',
    title: 'Business & Professional Kiswahili',
    category: 'Professional',
    description: 'Professional correspondence, conference terms, and formal negotiations in East Africa.',
    level: 'Intermediate',
    icon: 'Briefcase',
    phrases: [
      { id: 'p22', swahili: 'Tungependa kushirikiana nanyi.', english: 'We would like to partner with you.', phonetic: 'toon-geh-PEHN-dah koo-shee-ree-kee-AH-nah NAH-nyee', context: 'Formal business partnership opening.' },
      { id: 'p23', swahili: 'Mkutano utaanza saa ngapi?', english: 'What time will the meeting begin?', phonetic: 'm-koo-TAH-noh oo-tah-AHN-zah SAH-ah NGAH-pee', context: 'Scheduling meetings.' },
      { id: 'p24', swahili: 'Makubaliano yameafikiwa.', english: 'The agreement has been reached.', phonetic: 'mah-koo-bah-lee-AH-noh yah-meh-ah-fee-KEE-wah', context: 'Formal contract closing.' }
    ]
  }
];

// Current logged in demo token simulation
let currentSessionUserId: string = 'user_teacher_1';

// API ROUTES

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Funza Mzungu API',
    version: '1.0.0',
    serverTime: new Date().toISOString()
  });
});

// Auth me
app.get('/api/auth/me', (req, res) => {
  const user = users.find(u => u.id === currentSessionUserId);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Demo switch
app.post('/api/auth/demo-switch', (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  currentSessionUserId = user.id;
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const {
    role,
    fullName,
    displayName,
    email,
    password,
    phoneNumber,
    mpesaNumber,
    country,
    preferredLanguage,
    languagesSpoken,
    kiswahiliLevel,
    bio,
    ageConfirmed,
    learningGoals
  } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required signup fields' });
  }

  if (!ageConfirmed) {
    return res.status(400).json({ error: 'You must confirm that you meet the minimum age requirement (18+).' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser: StoredUser = {
    id: `user_${role}_${Date.now()}`,
    email,
    passwordHash: hashPassword(password),
    role,
    fullName,
    displayName: displayName || fullName.split(' ')[0],
    avatar: `https://images.unsplash.com/photo-${role === 'teacher' ? '1534528741775-53994a69daeb' : '1506794778202-cad84cf45f1d'}?w=300&auto=format&fit=crop&q=80`,
    phoneNumber,
    mpesaNumber: mpesaNumber || phoneNumber,
    country: country || 'Kenya',
    preferredLanguage: preferredLanguage || 'English',
    languagesSpoken: Array.isArray(languagesSpoken) ? languagesSpoken : ['Kiswahili', 'English'],
    kiswahiliLevel: kiswahiliLevel || (role === 'teacher' ? 'Native / Fluent' : 'Beginner'),
    bio: bio || '',
    ageConfirmed: true,
    activationStatus: role === 'teacher' ? 'not_activated' : 'activated',
    isVerified: false,
    isOnline: true,
    rating: 5.0,
    totalReviews: 0,
    completedHours: 0,
    totalSessions: 0,
    preferredTopics: ['Greetings & Respectful Introductions', 'Everyday Conversation'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['Morning (9am - 12pm)', 'Afternoon (2pm - 6pm)'],
      isAvailableToday: true,
    },
    learningGoals: learningGoals || '',
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  currentSessionUserId = newUser.id;

  const { passwordHash: _, ...safeUser } = newUser;
  res.json({
    success: true,
    user: safeUser,
    message: role === 'teacher' 
      ? 'Account created. Please complete the one-time KSh 600 activation to begin receiving sessions.'
      : 'Account created successfully. Welcome to Funza Mzungu!'
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email address or password' });
  }
  if (user.activationStatus === 'suspended') {
    return res.status(403).json({ error: 'Your account has been suspended due to community guidelines violation. Contact support@funzamzungu.com' });
  }

  currentSessionUserId = user.id;
  user.isOnline = true;
  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// Teachers list & discovery
app.get('/api/teachers', (req, res) => {
  const { search, online, country, level, availableToday } = req.query;
  let list = users.filter(u => u.role === 'teacher');

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(t => 
      t.fullName.toLowerCase().includes(q) ||
      t.displayName.toLowerCase().includes(q) ||
      (t.bio && t.bio.toLowerCase().includes(q)) ||
      (t.preferredTopics && t.preferredTopics.some(topic => topic.toLowerCase().includes(q)))
    );
  }

  if (online === 'true') {
    list = list.filter(t => t.isOnline);
  }

  if (country) {
    list = list.filter(t => t.country.toLowerCase() === String(country).toLowerCase());
  }

  if (level) {
    list = list.filter(t => t.kiswahiliLevel === level);
  }

  if (availableToday === 'true') {
    list = list.filter(t => t.availability?.isAvailableToday);
  }

  const safeList = list.map(({ passwordHash, ...safe }) => safe);
  res.json({ teachers: safeList });
});

// Teacher profile by ID
app.get('/api/teachers/:id', (req, res) => {
  const teacher = users.find(u => u.id === req.params.id && u.role === 'teacher');
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }
  const { passwordHash, ...safe } = teacher;
  res.json({ teacher: safe });
});

// Update profile / availability
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { bio, isOnline, availability, preferredTopics, mpesaNumber, languagesSpoken, displayName } = req.body;
  if (bio !== undefined) user.bio = bio;
  if (isOnline !== undefined) user.isOnline = isOnline;
  if (availability !== undefined) user.availability = { ...user.availability, ...availability };
  if (preferredTopics !== undefined) user.preferredTopics = preferredTopics;
  if (mpesaNumber !== undefined) user.mpesaNumber = mpesaNumber;
  if (languagesSpoken !== undefined) user.languagesSpoken = languagesSpoken;
  if (displayName !== undefined) user.displayName = displayName;

  const { passwordHash, ...safe } = user;
  res.json({ success: true, user: safe });
});

// TEACHER ACTIVATION (M-Pesa KSh 600)
app.post('/api/activation/initiate', (req, res) => {
  const { teacherId, mpesaPhone } = req.body;
  const teacher = users.find(u => u.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher account not found' });
  }

  const cleanPhone = (mpesaPhone || teacher.mpesaNumber || teacher.phoneNumber || '').replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 9) {
    return res.status(400).json({ error: 'Please enter a valid Safaricom M-Pesa phone number.' });
  }

  teacher.activationStatus = 'payment_pending';

  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 89999 + 10000)}`;

  res.json({
    success: true,
    checkoutRequestId,
    paybill: '174379',
    accountNumber: `FMZ-${teacher.id.slice(-6).toUpperCase()}`,
    amount: 600,
    phone: cleanPhone,
    message: `STK Push prompt dispatched to ${cleanPhone}. Please enter your M-Pesa PIN on your phone to complete activation.`
  });
});

app.post('/api/activation/confirm', (req, res) => {
  const { teacherId, mpesaCode } = req.body;
  const teacher = users.find(u => u.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher account not found' });
  }

  const ref = mpesaCode ? mpesaCode.toUpperCase() : `QK${Math.floor(Math.random() * 899999 + 100000)}`;

  teacher.activationStatus = 'activated';
  teacher.isVerified = true;

  const txn: StoredTransaction = {
    id: `txn_act_${Date.now()}`,
    userId: teacher.id,
    userName: teacher.displayName,
    amount: 600,
    type: 'activation',
    status: 'successful',
    paymentMethod: 'M-Pesa',
    reference: ref,
    description: 'Teacher Account Activation Fee (KSh 600) - Account Verified',
    timestamp: Date.now()
  };
  transactions.unshift(txn);

  const { passwordHash, ...safe } = teacher;
  res.json({
    success: true,
    user: safe,
    transaction: txn,
    message: 'Your teacher account is now active.'
  });
});

// SESSIONS SYSTEM & SERVER-VERIFIED TIMING
app.post('/api/sessions/request', (req, res) => {
  const { teacherId, learnerId, topic, notes } = req.body;
  const teacher = users.find(u => u.id === teacherId);
  const learner = users.find(u => u.id === learnerId);

  if (!teacher || !learner) {
    return res.status(404).json({ error: 'Teacher or learner not found' });
  }

  if (teacher.activationStatus !== 'activated') {
    return res.status(400).json({ error: 'Teacher has not completed account activation yet.' });
  }

  const newSession: StoredSession = {
    id: `ses_${Date.now()}`,
    teacherId: teacher.id,
    learnerId: learner.id,
    teacherName: teacher.displayName,
    teacherAvatar: teacher.avatar,
    learnerName: learner.displayName,
    learnerAvatar: learner.avatar,
    topic: topic || 'Everyday Kiswahili Conversation',
    status: 'active', // starts immediately for smooth chat
    startedAt: Date.now(),
    verifiedSeconds: 0,
    earnedAmount: 0,
    learnerNotes: notes || '',
    createdAt: Date.now()
  };

  sessions.unshift(newSession);

  // Initial welcome message
  messages.push({
    id: `msg_${Date.now()}`,
    sessionId: newSession.id,
    senderId: 'system',
    senderName: 'Funza Mzungu System',
    senderRole: 'admin',
    text: `Session started! Topic: "${newSession.topic}". The verified timer is running at KSh 500/hour. Remember that conversations are monitored for learner safety.`,
    timestamp: Date.now(),
    isSystem: true
  });

  res.json({ success: true, session: newSession });
});

// Get session details with real-time verified timer from server clock
app.get('/api/sessions/:id', (req, res) => {
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  let currentVerifiedSeconds = session.verifiedSeconds;
  let currentEarned = session.earnedAmount;

  if (session.status === 'active' && session.startedAt) {
    const elapsedMs = Date.now() - session.startedAt;
    currentVerifiedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
    // Rate: KSh 500 per 3600 seconds = ~0.138888 KSh per second
    currentEarned = Math.round((currentVerifiedSeconds / 3600) * 500 * 10) / 10;
  }

  res.json({
    session: {
      ...session,
      verifiedSeconds: currentVerifiedSeconds,
      earnedAmount: currentEarned,
      serverTime: Date.now()
    }
  });
});

// End session with strict server-side calculation
app.post('/api/sessions/:id/end', (req, res) => {
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (session.status === 'completed') {
    return res.json({ session, message: 'Session already concluded.' });
  }

  const now = Date.now();
  session.endedAt = now;
  session.status = 'completed';

  const elapsedMs = session.startedAt ? now - session.startedAt : 0;
  // Calculate verified duration in seconds
  const verifiedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  session.verifiedSeconds = verifiedSeconds;

  // Rate: KSh 500 per hour (pro-rated)
  const earned = Math.max(0, Math.round((verifiedSeconds / 3600) * 500));
  session.earnedAmount = earned;

  // Credit teacher
  const teacher = users.find(u => u.id === session.teacherId);
  if (teacher) {
    teacher.availableBalance += earned;
    teacher.completedHours += Math.round((verifiedSeconds / 3600) * 10) / 10;
    teacher.totalSessions += 1;

    if (earned > 0) {
      transactions.unshift({
        id: `txn_earn_${Date.now()}`,
        userId: teacher.id,
        userName: teacher.displayName,
        amount: earned,
        type: 'session_earning',
        status: 'successful',
        paymentMethod: 'Platform Balance',
        reference: `SES-${session.id.slice(-6).toUpperCase()}`,
        description: `Verified Teaching Earnings: ${Math.round(verifiedSeconds / 60)} mins with ${session.learnerName} at KSh 500/hr`,
        timestamp: Date.now()
      });
    }
  }

  // Learner completed session update
  const learner = users.find(u => u.id === session.learnerId);
  if (learner) {
    learner.completedHours += Math.round((verifiedSeconds / 3600) * 10) / 10;
    learner.totalSessions += 1;
  }

  // System closing message
  messages.push({
    id: `msg_${Date.now()}`,
    sessionId: session.id,
    senderId: 'system',
    senderName: 'System',
    senderRole: 'admin',
    text: `Session concluded. Verified duration: ${Math.floor(verifiedSeconds / 60)} minutes ${verifiedSeconds % 60} seconds. Eligible earnings: KSh ${earned}.`,
    timestamp: Date.now(),
    isSystem: true
  });

  res.json({
    success: true,
    session,
    verifiedDurationMinutes: Math.floor(verifiedSeconds / 60),
    eligibleEarnings: earned,
    message: `Session concluded. Verified duration: ${Math.floor(verifiedSeconds / 60)} minutes. Eligible earnings: KSh ${earned}.`
  });
});

// Rate session
app.post('/api/sessions/:id/rate', (req, res) => {
  const { rating, reviewText } = req.body;
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  session.rating = Number(rating) || 5;
  session.reviewText = reviewText || '';

  const teacher = users.find(u => u.id === session.teacherId);
  if (teacher) {
    const currentTotal = teacher.rating * teacher.totalReviews;
    teacher.totalReviews += 1;
    teacher.rating = Math.round(((currentTotal + session.rating) / teacher.totalReviews) * 100) / 100;
  }

  res.json({ success: true, session });
});

// Get user's sessions
app.get('/api/sessions/user/:userId', (req, res) => {
  const userSessions = sessions.filter(s => s.teacherId === req.params.userId || s.learnerId === req.params.userId);
  res.json({ sessions: userSessions });
});

// MESSAGES (Chat)
app.get('/api/sessions/:id/messages', (req, res) => {
  const list = messages.filter(m => m.sessionId === req.params.id);
  res.json({ messages: list });
});

app.post('/api/sessions/:id/messages', (req, res) => {
  const { senderId, text } = req.body;
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const sender = users.find(u => u.id === senderId);
  if (!sender) {
    return res.status(404).json({ error: 'Sender user not found' });
  }

  // Basic profanity / safety check simulation
  const blockedKeywords = ['western union', 'send crypto', 'whatsapp number +', 'private bitcoin'];
  const hasViolation = blockedKeywords.some(w => (text || '').toLowerCase().includes(w));
  if (hasViolation) {
    return res.status(400).json({ error: 'Message blocked by platform safety filter: Sharing off-platform payment methods or financial accounts is prohibited.' });
  }

  const newMsg: StoredMessage = {
    id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    sessionId: session.id,
    senderId: sender.id,
    senderName: sender.displayName,
    senderRole: sender.role,
    text,
    timestamp: Date.now()
  };

  messages.push(newMsg);
  res.json({ success: true, message: newMsg });
});

// EARNINGS & M-PESA WITHDRAWALS
app.get('/api/teachers/:id/earnings', (req, res) => {
  const teacher = users.find(u => u.id === req.params.id);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }

  const teacherSessions = sessions.filter(s => s.teacherId === teacher.id && s.status === 'completed');
  const now = Date.now();
  const oneDayAgo = now - 86400000;
  const oneWeekAgo = now - 86400000 * 7;
  const oneMonthAgo = now - 86400000 * 30;

  const todaysEarnings = teacherSessions
    .filter(s => (s.endedAt || s.createdAt) >= oneDayAgo)
    .reduce((sum, s) => sum + s.earnedAmount, 0);

  const thisWeeksEarnings = teacherSessions
    .filter(s => (s.endedAt || s.createdAt) >= oneWeekAgo)
    .reduce((sum, s) => sum + s.earnedAmount, 0);

  const thisMonthsEarnings = teacherSessions
    .filter(s => (s.endedAt || s.createdAt) >= oneMonthAgo)
    .reduce((sum, s) => sum + s.earnedAmount, 0);

  const lifetimeEarnings = teacherSessions.reduce((sum, s) => sum + s.earnedAmount, 0);

  res.json({
    summary: {
      todaysEarnings,
      thisWeeksEarnings,
      thisMonthsEarnings,
      availableBalance: teacher.availableBalance,
      pendingBalance: teacher.pendingBalance,
      totalWithdrawn: teacher.totalWithdrawn,
      lifetimeEarnings: Math.max(lifetimeEarnings, teacher.availableBalance + teacher.totalWithdrawn)
    }
  });
});

app.post('/api/withdrawals/request', (req, res) => {
  const { teacherId, mpesaNumber, amount } = req.body;
  const teacher = users.find(u => u.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }

  const withdrawAmount = Number(amount);
  if (isNaN(withdrawAmount) || withdrawAmount < 500) {
    return res.status(400).json({ error: 'Minimum withdrawal amount is KSh 500.' });
  }

  if (withdrawAmount > teacher.availableBalance) {
    return res.status(400).json({ error: `Insufficient available balance. You have KSh ${teacher.availableBalance.toLocaleString()} available.` });
  }

  const phone = (mpesaNumber || teacher.mpesaNumber || '').trim();
  if (!phone || phone.length < 9) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit Kenyan M-Pesa phone number (e.g. 0712345678).' });
  }

  const fee = 15; // Standard Safaricom B2C fee
  const netAmount = withdrawAmount - fee;

  // Debit balance to pending
  teacher.availableBalance -= withdrawAmount;
  teacher.pendingBalance += withdrawAmount;

  const newWithdrawal: StoredWithdrawal = {
    id: `wth_${Date.now()}`,
    teacherId: teacher.id,
    teacherName: teacher.displayName,
    mpesaNumber: phone,
    amount: withdrawAmount,
    fee,
    netAmount,
    status: 'pending',
    requestedAt: Date.now(),
    reference: `REQ-${Math.floor(Math.random() * 89999 + 10000)}`,
    adminNotes: 'M-Pesa B2C withdrawal request pending disbursement queue.'
  };

  withdrawals.unshift(newWithdrawal);

  transactions.unshift({
    id: `txn_wth_${Date.now()}`,
    userId: teacher.id,
    userName: teacher.displayName,
    amount: withdrawAmount,
    type: 'withdrawal',
    status: 'pending',
    paymentMethod: 'M-Pesa',
    reference: newWithdrawal.reference || 'REQ-MPESA',
    description: `M-Pesa Withdrawal Request to ${phone} (Fee KSh 15, Net KSh ${netAmount})`,
    timestamp: Date.now()
  });

  res.json({
    success: true,
    withdrawal: newWithdrawal,
    availableBalance: teacher.availableBalance,
    pendingBalance: teacher.pendingBalance,
    message: `Withdrawal request of KSh ${withdrawAmount.toLocaleString()} submitted. Funds will be sent to ${phone} after security validation.`
  });
});

app.get('/api/withdrawals/teacher/:id', (req, res) => {
  const list = withdrawals.filter(w => w.teacherId === req.params.id);
  res.json({ withdrawals: list });
});

// Full transactions ledger for a user
app.get('/api/transactions/user/:userId', (req, res) => {
  const list = transactions.filter(t => t.userId === req.params.userId);
  res.json({ transactions: list });
});

// ABUSE REPORTING & SAFETY
app.post('/api/reports', (req, res) => {
  const { reporterId, reportedUserId, sessionId, reason, details } = req.body;
  const reporter = users.find(u => u.id === reporterId);
  const reported = users.find(u => u.id === reportedUserId);

  if (!reporter || !reported) {
    return res.status(404).json({ error: 'Reporter or reported user not found.' });
  }

  if (!reason || !details) {
    return res.status(400).json({ error: 'Please provide both reason and explanation of the issue.' });
  }

  const newReport: StoredReport = {
    id: `rep_${Date.now()}`,
    reporterId: reporter.id,
    reporterName: reporter.displayName,
    reportedUserId: reported.id,
    reportedUserName: reported.displayName,
    sessionId,
    reason,
    details,
    status: 'pending',
    createdAt: Date.now()
  };

  reports.unshift(newReport);
  res.json({
    success: true,
    report: newReport,
    message: 'Report submitted securely to Funza Mzungu Trust & Safety team. Strangers safety is our highest priority.'
  });
});

// ADMIN PANEL ENDPOINTS
app.get('/api/admin/stats', (req, res) => {
  const totalUsers = users.length;
  const activeTeachers = users.filter(u => u.role === 'teacher' && u.activationStatus === 'activated').length;
  const activeLearners = users.filter(u => u.role === 'learner').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const sessionsToday = sessions.filter(s => s.createdAt >= Date.now() - 86400000).length;
  const teacherEarningsTotal = sessions.reduce((sum, s) => sum + s.earnedAmount, 0);
  const platformRevenue = users.filter(u => u.activationStatus === 'activated' && u.role === 'teacher').length * 600;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const successfulWithdrawals = withdrawals.filter(w => w.status === 'completed').length;

  res.json({
    stats: {
      totalUsers,
      activeTeachers,
      activeLearners,
      sessionsToday,
      completedSessions,
      teacherEarningsTotal,
      platformRevenue,
      pendingWithdrawals,
      successfulWithdrawals
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  const safeUsers = users.map(({ passwordHash, ...safe }) => safe);
  res.json({ users: safeUsers });
});

app.post('/api/admin/users/:id/status', (req, res) => {
  const { activationStatus, isVerified } = req.body;
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (activationStatus) user.activationStatus = activationStatus;
  if (isVerified !== undefined) user.isVerified = isVerified;

  const { passwordHash, ...safe } = user;
  res.json({ success: true, user: safe });
});

app.get('/api/admin/withdrawals', (req, res) => {
  res.json({ withdrawals });
});

app.post('/api/admin/withdrawals/:id/action', (req, res) => {
  const { action, adminNotes } = req.body; // 'approve' or 'reject'
  const w = withdrawals.find(item => item.id === req.params.id);
  if (!w) {
    return res.status(404).json({ error: 'Withdrawal record not found' });
  }

  const teacher = users.find(u => u.id === w.teacherId);

  if (action === 'approve') {
    w.status = 'completed';
    w.processedAt = Date.now();
    w.reference = `QB${Math.floor(Math.random() * 899999 + 100000)}B2C`;
    w.adminNotes = adminNotes || 'Approved by Admin. M-Pesa B2C disbursement successful.';

    if (teacher) {
      teacher.pendingBalance = Math.max(0, teacher.pendingBalance - w.amount);
      teacher.totalWithdrawn += w.netAmount;
    }

    // Update transaction
    const txn = transactions.find(t => t.reference === w.reference || t.userId === w.teacherId && t.status === 'pending');
    if (txn) {
      txn.status = 'successful';
      txn.reference = w.reference;
    }
  } else if (action === 'reject') {
    w.status = 'failed';
    w.adminNotes = adminNotes || 'Rejected by Admin. Funds returned to teacher available balance.';

    if (teacher) {
      teacher.pendingBalance = Math.max(0, teacher.pendingBalance - w.amount);
      teacher.availableBalance += w.amount;
    }

    const txn = transactions.find(t => t.reference === w.reference || t.userId === w.teacherId && t.status === 'pending');
    if (txn) {
      txn.status = 'cancelled';
    }
  }

  res.json({ success: true, withdrawal: w });
});

app.get('/api/admin/reports', (req, res) => {
  res.json({ reports });
});

app.post('/api/admin/reports/:id/resolve', (req, res) => {
  const { status, actionTaken } = req.body;
  const r = reports.find(item => item.id === req.params.id);
  if (!r) {
    return res.status(404).json({ error: 'Report not found' });
  }

  r.status = status || 'resolved';
  r.actionTaken = actionTaken || 'Reviewed and addressed.';
  res.json({ success: true, report: r });
});

// TOPICS & VOCABULARY
app.get('/api/topics', (req, res) => {
  res.json({ topics: learningTopics });
});

app.get('/api/announcements', (req, res) => {
  res.json({ announcements });
});

// M-Pesa Daraja Callback Simulation endpoint for production readiness
app.post('/api/payments/mpesa/callback', (req, res) => {
  console.log('[M-Pesa Daraja Webhook Callback]', req.body);
  res.json({ ResultCode: 0, ResultDesc: 'Accepted successfully' });
});

// AI LEARNERS CHAT ENGINE
const aiRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkAIRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = aiRateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    aiRateLimits.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 35) {
    return false;
  }
  entry.count++;
  return true;
}

let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// Helper to extract swahili words and check if user corrected the AI
function analyzeConversationStep(userText: string) {
  const swahiliPattern = /\b(habari|jambo|asante|karibu|sana|mambo|poa|rafiki|kwaheri|ndiyo|hapana|chakula|maji|chai|nyama|matatu|pesa|ngapi|wapi|leo|kesho|sasa|nzuri|salama|sawa|naitwa|ninapenda|shikamoo|marahaba|mzungu|funza|pole|safari|boda|duka|shule|kitabu|kazi|jua|mvua|nyumba)\b/gi;
  const matches = userText.match(swahiliPattern) || [];
  const uniqueWords = Array.from(new Set(matches.map(w => w.toLowerCase())));

  const correctionKeywords = ['say', 'not', 'instead', 'correction', 'correct', 'means', 'meaning', 'use', 'husemi', 'unapaswa', 'neno'];
  const isCorrection = correctionKeywords.some(kw => userText.toLowerCase().includes(kw));

  return {
    wordsFound: uniqueWords,
    isCorrection
  };
}

// Dynamic realistic fallback responder if Gemini API is offline or key not supplied
function generateFallbackAIResponse(
  profile: any,
  userMessage: string,
  history: { sender: string; text: string }[],
  topic?: string
): string {
  const lower = userMessage.toLowerCase().trim();
  const name = profile.name || 'Friend';
  const country = profile.country || 'abroad';
  const interests = profile.interests || ['Kenya', 'travel', 'languages'];

  // Did the user ask if the AI is a real person?
  if (lower.includes('real person') || lower.includes('human') || lower.includes('robot') || lower.includes('are you real')) {
    return `To be completely transparent, I am an AI learner designed to practice Kiswahili with you, not a real human! 😊 But I'm genuinely trying to learn conversational Swahili for ${profile.learningGoal || 'my journey'}. Can you teach me what 'Karibu' means?`;
  }

  // Greetings handling
  if (lower.includes('habari') || lower.includes('jambo') || lower.includes('hujambo') || lower.includes('mambo') || lower.includes('sasa')) {
    const responses = [
      `Nzuri sana! 😊 I remembered that 'Nzuri' is the reply! How are you doing today? Can you teach me how to say "I am happy to meet you"?`,
      `Safi! Or should I say 'Salama'? 😄 In ${country}, we usually just say casual greetings, but I love how melodic Kiswahili sounds. Did I pronounce it right?`,
      `Jambo rafiki! 👋 Wait, someone told me 'Jambo' is mostly for tourists, and Kenyans prefer 'Habari yako?' or 'Sasa?'. Is that true?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Name / Self introduction
  if (lower.includes('naitwa') || lower.includes('my name is') || lower.includes('jina langu')) {
    return `Nice to meet you! 😊 Ninafurahi kukutana nawe! Did I form that sentence right? I'm ${name} from ${country}. How do I say "Where do you live in Kenya?" in Swahili?`;
  }

  // Food discussion
  if (topic === 'food' || lower.includes('chakula') || lower.includes('ugali') || lower.includes('chai') || lower.includes('sukuma') || lower.includes('nyama') || lower.includes('food') || lower.includes('eat')) {
    return `Oh, delicious! 🍛 I keep hearing about Ugali na Nyama Choma, and of course Kenyan spiced chai! How do I say "I would like to order a cup of tea, please" when I'm at a local cafe?`;
  }

  // Travel / Transport discussion
  if (topic === 'transport' || topic === 'travel' || lower.includes('matatu') || lower.includes('boda') || lower.includes('safari') || lower.includes('travel') || lower.includes('airport') || lower.includes('ticket')) {
    return `That's so useful for travel! ✈️ If I am taking a Matatu in Nairobi, what do I say to the conductor when I want to alight? Is it 'Shukisha hapo' or something like that?`;
  }

  // Price / Shopping / Bargaining
  if (topic === 'shopping' || lower.includes('bei') || lower.includes('pesa') || lower.includes('cost') || lower.includes('how much') || lower.includes('market') || lower.includes('discount')) {
    return `Aha! Shopping at open-air markets is one of my big goals. 🛒 If a vendor tells me a price and I want to ask politely for a small discount, what is the best phrase to use? "Punguza kidogo"?`;
  }

  // Correction handling
  if (lower.includes('say') || lower.includes('correct') || lower.includes('instead') || lower.includes('means')) {
    return `Oh! Thank you for correcting me! 🙏 That makes total sense. So I should say "${userMessage.replace(/^(say|instead|it means|no)/i, '').trim()}"? Let me write that down in my notes. Can you give me an example of how you would use that in a full sentence?`;
  }

  // Default natural engaging follow-up
  const followUps = [
    `That's really interesting! 💡 Could you teach me how to say that in everyday Kiswahili? For example, how would you say it to a close friend versus someone older?`,
    `Asante sana for explaining that! 😊 As someone from ${country}, the grammar structure is fascinating to me. What is another word or phrase that Kenyans use often when discussing this?`,
    `Oh, I see! So if I wanted to say "I like this very much" in Swahili, would I say "Ninapenda hii sana"? Did I get the prefix right?`,
    `Wait, can I repeat that back to make sure I got it right? 😊 How would a native speaker say that in casual Nairobi Sheng or Sanifu Swahili?`
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
}

app.post('/api/ai-chat', async (req, res) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    if (!checkAIRateLimit(String(clientIp))) {
      return res.status(429).json({
        error: 'Too many messages. Please slow down slightly to allow your AI conversation partner to reflect.'
      });
    }

    const { profile, messages, topic } = req.body;
    if (!profile || !messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Missing profile or conversation messages' });
    }

    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage?.text || '';
    if (userText.length > 1500) {
      return res.status(400).json({ error: 'Message exceeds maximum length' });
    }

    const analysis = analyzeConversationStep(userText);

    const gemini = getGemini();
    if (!gemini) {
      // Graceful native fallback
      const reply = generateFallbackAIResponse(profile, userText, messages, topic);
      return res.json({
        reply,
        wordsLearned: analysis.wordsFound,
        isCorrection: analysis.isCorrection,
        mode: 'simulated-learner'
      });
    }

    // Call Gemini with strict system instructions
    const systemInstruction = `You are an international language learner practicing Kiswahili with a Kiswahili-speaking teacher.
Your name is ${profile.name} from ${profile.country}.
Your native language is ${profile.nativeLanguage}.
Your Kiswahili level is ${profile.kiswahiliLevel}.
Your personality type is: ${profile.personality}.
Your personal learning goal is: "${profile.learningGoal}".
Your interests: ${Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests}.
${topic ? `Current discussion topic focus: ${topic}` : ''}

CRITICAL RULES:
1. You are NOT a human and must never claim to be a real person. If asked whether you are a real person, clearly answer that you are an AI learner.
2. Speak naturally, warmly, and authentically like an eager foreign student.
3. NEVER sound like a robotic corporate assistant ("How may I help you?", "I am ready to assist"). Instead speak like a real peer: "Hey! 😊 I'm trying to improve my Swahili...", "Oh, wait! Did I say that right?".
4. Use English when needed, but gradually incorporate Kiswahili words and phrases you know.
5. Ask questions! Encourage the teacher to teach you new Kiswahili words, greetings, Kenyan slang (Sheng), or pronunciation.
6. Make occasional realistic beginner mistakes (e.g. wrong noun prefix or awkward literal translation), but never give false factual information.
7. When the teacher corrects you, acknowledge the correction gladly ("Oh, asante! Let me try that again...") and use the corrected phrase.
8. Discuss everyday topics such as travel, food, family, work, school, Kenyan culture, transport, music, and daily life.
9. Keep your responses concise (1 to 3 short conversational paragraphs) with friendly emojis.`;

    // Map conversation history to contents array
    const contents = messages.slice(-10).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      });

      const replyText = response.text || generateFallbackAIResponse(profile, userText, messages, topic);
      return res.json({
        reply: replyText.trim(),
        wordsLearned: analysis.wordsFound,
        isCorrection: analysis.isCorrection,
        mode: 'gemini-ai'
      });
    } catch (apiErr: any) {
      console.warn('[Gemini API Call failed, falling back to local learner engine]:', apiErr.message);
      const fallbackReply = generateFallbackAIResponse(profile, userText, messages, topic);
      return res.json({
        reply: fallbackReply,
        wordsLearned: analysis.wordsFound,
        isCorrection: analysis.isCorrection,
        mode: 'simulated-learner'
      });
    }
  } catch (err: any) {
    console.error('[AI Chat Error]:', err);
    res.status(500).json({ error: 'Failed to process AI learner conversation' });
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Funza Mzungu server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
