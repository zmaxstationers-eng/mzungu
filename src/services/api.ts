import {
  User,
  Session,
  Message,
  Transaction,
  WithdrawalRequest,
  AbuseReport,
  LearningTopic,
  TeacherEarningsSummary,
  PlatformStats
} from '../types';

export const api = {
  // Auth
  async getMe(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch (e) {
      return null;
    }
  },

  async switchDemoUser(userId: string): Promise<User> {
    const res = await fetch('/api/auth/demo-switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to switch user');
    return data.user;
  },

  async login(email: string, password: string): Promise<User> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data.user;
  },

  async register(formData: any): Promise<{ user: User; message: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  // Teachers
  async getTeachers(params?: { search?: string; online?: boolean; level?: string; country?: string; availableToday?: boolean }): Promise<User[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.online) query.set('online', 'true');
    if (params?.level) query.set('level', params.level);
    if (params?.country) query.set('country', params.country);
    if (params?.availableToday) query.set('availableToday', 'true');

    const res = await fetch(`/api/teachers?${query.toString()}`);
    const data = await res.json();
    return data.teachers || [];
  },

  async getTeacherById(id: string): Promise<User> {
    const res = await fetch(`/api/teachers/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Teacher not found');
    return data.teacher;
  },

  async updateProfile(userId: string, payload: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    return data.user;
  },

  // Teacher Activation (KSh 600)
  async initiateActivation(teacherId: string, mpesaPhone: string) {
    const res = await fetch('/api/activation/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, mpesaPhone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Activation initiation failed');
    return data;
  },

  async confirmActivation(teacherId: string, mpesaCode?: string): Promise<{ user: User; message: string; transaction: Transaction }> {
    const res = await fetch('/api/activation/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, mpesaCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Activation confirmation failed');
    return data;
  },

  // Sessions
  async requestSession(teacherId: string, learnerId: string, topic?: string, notes?: string): Promise<Session> {
    const res = await fetch('/api/sessions/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, learnerId, topic, notes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start session');
    return data.session;
  },

  async getSession(id: string): Promise<Session> {
    const res = await fetch(`/api/sessions/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Session not found');
    return data.session;
  },

  async endSession(id: string): Promise<{ session: Session; verifiedDurationMinutes: number; eligibleEarnings: number; message: string }> {
    const res = await fetch(`/api/sessions/${id}/end`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to end session');
    return data;
  },

  async rateSession(sessionId: string, rating: number, reviewText: string): Promise<Session> {
    const res = await fetch(`/api/sessions/${sessionId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, reviewText }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit rating');
    return data.session;
  },

  async getUserSessions(userId: string): Promise<Session[]> {
    const res = await fetch(`/api/sessions/user/${userId}`);
    const data = await res.json();
    return data.sessions || [];
  },

  // Chat Messages
  async getMessages(sessionId: string): Promise<Message[]> {
    const res = await fetch(`/api/sessions/${sessionId}/messages`);
    const data = await res.json();
    return data.messages || [];
  },

  async sendMessage(sessionId: string, senderId: string, text: string): Promise<Message> {
    const res = await fetch(`/api/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return data.message;
  },

  // Earnings & Withdrawals
  async getTeacherEarnings(teacherId: string): Promise<TeacherEarningsSummary> {
    const res = await fetch(`/api/teachers/${teacherId}/earnings`);
    const data = await res.json();
    return data.summary;
  },

  async requestWithdrawal(teacherId: string, mpesaNumber: string, amount: number) {
    const res = await fetch('/api/withdrawals/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, mpesaNumber, amount }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Withdrawal failed');
    return data;
  },

  async getTeacherWithdrawals(teacherId: string): Promise<WithdrawalRequest[]> {
    const res = await fetch(`/api/withdrawals/teacher/${teacherId}`);
    const data = await res.json();
    return data.withdrawals || [];
  },

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const res = await fetch(`/api/transactions/user/${userId}`);
    const data = await res.json();
    return data.transactions || [];
  },

  // Abuse Reports & Moderation
  async submitReport(payload: { reporterId: string; reportedUserId: string; sessionId?: string; reason: string; details: string }) {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit report');
    return data;
  },

  // Admin APIs
  async getAdminStats(): Promise<PlatformStats> {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    return data.stats;
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    return data.users || [];
  },

  async updateAdminUserStatus(userId: string, payload: { activationStatus?: string; isVerified?: boolean }): Promise<User> {
    const res = await fetch(`/api/admin/users/${userId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.user;
  },

  async getAdminWithdrawals(): Promise<WithdrawalRequest[]> {
    const res = await fetch('/api/admin/withdrawals');
    const data = await res.json();
    return data.withdrawals || [];
  },

  async actOnWithdrawal(withdrawalId: string, action: 'approve' | 'reject', adminNotes?: string): Promise<WithdrawalRequest> {
    const res = await fetch(`/api/admin/withdrawals/${withdrawalId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNotes }),
    });
    const data = await res.json();
    return data.withdrawal;
  },

  async getAdminReports(): Promise<AbuseReport[]> {
    const res = await fetch('/api/admin/reports');
    const data = await res.json();
    return data.reports || [];
  },

  async resolveReport(reportId: string, status: string, actionTaken: string) {
    const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actionTaken }),
    });
    return res.json();
  },

  // Topics & Announcements
  async getTopics(): Promise<LearningTopic[]> {
    const res = await fetch('/api/topics');
    const data = await res.json();
    return data.topics || [];
  },

  async getAnnouncements(): Promise<any[]> {
    const res = await fetch('/api/announcements');
    const data = await res.json();
    return data.announcements || [];
  },

  // AI Learners Chat
  async sendAIChatMessage(payload: {
    profile: any;
    messages: { sender: 'user' | 'ai'; text: string }[];
    topic?: string;
  }): Promise<{ reply: string; wordsLearned?: string[]; isCorrection?: boolean; mode?: string }> {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to get response from AI learner');
    return data;
  }
};

