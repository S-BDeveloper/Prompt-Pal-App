import axios from 'axios';
import axiosRetry from 'axios-retry';
import { tokenCache } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { triggerSignOut, tryRefreshToken } from '@/lib/session-manager';
import { record401Error } from '@/lib/auth-diagnostics';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000') + '/api/v1';
const API_TIMEOUT_MS = 10000; // 10 seconds for regular API calls

// Type for token provider
type TokenProvider = () => Promise<string | null>;
let authTokenProvider: TokenProvider | null = null;

/**
 * Sets the token provider for the API client.
 * This should be called from a React component using useAuth().
 */
export const setTokenProvider = (provider: TokenProvider) => {
  authTokenProvider = provider;
};

// Helper function to construct full API URLs
const buildApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

// Helper function for legacy API URLs (without /v1)
const buildLegacyApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000') + '/api';
  return `${baseUrl}${normalizedPath}`;
};

export const api = axios.create({
  timeout: API_TIMEOUT_MS,
});

// Configure retry logic with exponential backoff
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors, 5xx server errors, but not on 4xx client errors (except 429)
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           (error.response?.status && error.response.status >= 500) ||
           error.response?.status === 429;
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn('API', `Request failed, retrying (${retryCount}/3)`, {
      url: requestConfig.url,
      status: error.response?.status,
    });
  },
});

// Request interceptor for JWT token
api.interceptors.request.use(async (config) => {
  try {
    let token = null;
    if (authTokenProvider) {
      token = await authTokenProvider();
    } else {
      // Fallback to cache if provider not set (e.g. during early initialization)
      token = await tokenCache.getToken('__clerk_client_jwt');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    logger.error('API', error, { operation: 'getAuthToken' });
  }

  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Record this 401 error for diagnostics
      if (error.config?.url) {
        record401Error(error.config.url);
      }

      // Token expired - try to refresh before signing out
      logger.warn('API', 'Authentication failed - attempting token refresh', {
        url: error.config?.url,
        status: error.response?.status,
        errorCode: error.response?.data?.errorCode
      });

      originalRequest._retry = true;

      try {
        const newToken = await tryRefreshToken();
        if (newToken) {
          // Token refreshed successfully, update headers and retry
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        logger.error('API', refreshError, { operation: 'tokenRefresh' });
      }

      // Token refresh failed, sign out user
      logger.warn('API', 'Token refresh failed - signing out');
      await triggerSignOut();
    } else {
      logger.error('API', error, {
        status: error.response?.status,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  }
);

// Types
export type ChallengeType = 'image' | 'code' | 'copywriting';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Level {
  id: string;
  type: ChallengeType;
  title: string;
  difficulty: Difficulty;
  passingScore: number;
  unlocked: boolean;

  // Image Challenge specific
  targetImageUrl?: string;
  hiddenPromptKeywords?: string[];
  style?: string;

  // Code/Logic Challenge specific
  moduleTitle?: string;
  requirementBrief?: string;
  requirementImage?: string;
  language?: string;
  testCases?: { id: string; name: string; passed: boolean }[];

  // Copywriting Challenge specific
  briefTitle?: string;
  briefProduct?: string;
  briefTarget?: string;
  briefTone?: string;
  briefGoal?: string;
  metrics?: { label: string; value: number }[];

  // Common metadata
  hints?: string[];
  estimatedTime?: number;
  points?: number;
  tags?: string[];
  learningObjectives?: string[];
  prerequisites?: string[];
}

export interface UserProgress {
  levelId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore: number;
  attempts: number;
  timeSpent: number;
  completedAt?: string;
  hintsUsed: number;
  firstAttemptScore: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  points: string;
  level?: number;
  title?: string;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface UserStatistics {
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  globalRank: number;
  points: number;
}

export interface LearningModule {
  id: string;
  category: string;
  title: string;
  level: string;
  topic: string;
  progress: number;
  icon: string;
  thumbnail?: any;
  accentColor: string;
  buttonText: string;
  type?: 'module' | 'course';
  format?: 'interactive' | 'video' | 'text';
  estimatedTime?: number;
}

export interface Resource {
  id: string;
  type: 'guide' | 'cheatsheet' | 'lexicon' | 'case-study';
  title: string;
  description: string;
  icon?: string;
  estimatedTime?: number;
  content?: any;
}

export interface LibraryCategory {
  category: string;
  modules: LearningModule[];
  resources: Resource[];
}

export interface LibraryData {
  userSummary: {
    totalXp: number;
    currentLevel: number;
    streak: number;
    completedLevels: number;
  };
  categories: LibraryCategory[];
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  timeRemaining: number;
  completed: boolean;
  expiresAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API Client Class
export class ApiClient {
  /**
   * Fetch all library data (modules + resources + user summary)
   */
  static async getLibraryData(): Promise<LibraryData> {
    try {
      const response = await api.get<ApiResponse<LibraryData>>(buildApiUrl('/library'));
      return response.data.data;
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getLibraryData' });
      throw error;
    }
  }

  /**
   * Fetch all levels from the backend
   */
  static async getLevels(): Promise<Level[]> {
    try {
      const response = await api.get<{ levels: Level[]; count: number }>(buildApiUrl('/levels'));
      // Handle both formats: { success: true, data: Level[] } or { levels: Level[], count: number }
      if ((response.data as any).data) return (response.data as any).data;
      return response.data.levels;
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getLevels' });
      throw error;
    }
  }

  /**
   * Fetch levels by type/category
   */
  static async getLevelsByType(type: ChallengeType): Promise<Level[]> {
    try {
      const response = await api.get<{ levels: Level[]; count: number }>(buildApiUrl(`/levels?type=${type}`));
      if ((response.data as any).data) return (response.data as any).data;
      return response.data.levels;
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getLevelsByType', type });
      throw error;
    }
  }

  /**
   * Fetch a specific level by ID
   */
  static async getLevelById(id: string): Promise<Level | null> {
    try {
      const response = await api.get<{ level: Level }>(buildApiUrl(`/levels/${id}`));
      if ((response.data as any).data) return (response.data as any).data;
      return response.data.level;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      logger.error('ApiClient', error, { operation: 'getLevelById', id });
      throw error;
    }
  }

  /**
   * Fetch user progress for all levels
   */
  static async getUserProgress(): Promise<Record<string, UserProgress>> {
    try {
      const response = await api.get<{ progress: UserProgress[]; count: number }>(buildApiUrl('/user/progress'));
      const progressArray = (response.data as any).data || response.data.progress || [];
      // Convert array to object keyed by levelId
      return progressArray.reduce((acc: Record<string, UserProgress>, progress: UserProgress) => {
        acc[progress.levelId] = progress;
        return acc;
      }, {} as Record<string, UserProgress>);
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getUserProgress' });
      throw error;
    }
  }

  /**
   * Update user progress for a specific level
   */
  static async updateUserProgress(levelId: string, progress: Partial<UserProgress>): Promise<void> {
    try {
      await api.put(buildApiUrl(`/user/progress/${levelId}`), progress);
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'updateUserProgress', levelId });
      throw error;
    }
  }

  /**
   * Update user progress statistics
   */
  static async updateUserProgressStats(progressData: {
    progress: {
      level: number;
      xp: number;
      currentStreak: number;
      longestStreak: number;
      lastActivityDate: string | null;
    }
  }): Promise<void> {
    try {
      // Add appId required by /api/user/progress endpoint
      const requestData = {
        appId: 'prompt-pal',
        ...progressData,
      };
      await api.put(buildLegacyApiUrl('/user/progress'), requestData);
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'updateUserProgressStats' });
      throw error;
    }
  }

  /**
   * Fetch leaderboard data
   */
  static async getLeaderboard(limit: number = 50): Promise<LeaderboardUser[]> {
    try {
      const response = await api.get<{ leaderboard: LeaderboardUser[]; continueCursor: string }>(buildApiUrl(`/leaderboard?limit=${limit}`));
      if ((response.data as any).data) return (response.data as any).data;
      return response.data.leaderboard;
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getLeaderboard', limit });
      throw error;
    }
  }

  /**
   * Fetch user's rank and surrounding players
   */
  static async getUserRank(): Promise<{ user: LeaderboardUser; nearby: LeaderboardUser[] }> {
    try {
      const response = await api.get<{ user: LeaderboardUser; nearby: LeaderboardUser[] }>(buildApiUrl('/user/rank'));
      if ((response.data as any).data) return (response.data as any).data;
      return response.data;
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getUserRank' });
      throw error;
    }
  }

  /**
   * Fetch user statistics
   */
  static async getUserStatistics(): Promise<UserStatistics> {
    try {
      const response = await api.get<{ statistics: UserStatistics }>(buildApiUrl('/user/statistics'));
      if ((response.data as any).data) return (response.data as any).data;
      return response.data.statistics;
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getUserStatistics' });
      throw error;
    }
  }

  /**
   * Fetch learning modules
   */
  static async getLearningModules(): Promise<LearningModule[]> {
    try {
      const response = await api.get<{ modules: LearningModule[]; count: number }>(buildApiUrl('/learning-modules'));
      if ((response.data as any).data) return (response.data as any).data;
      return response.data.modules || [];
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'getLearningModules' });
      return [];
    }
  }

  /**
   * Update learning module progress
   */
  static async updateModuleProgress(moduleId: string, progress: number): Promise<void> {
    try {
      await api.put(buildApiUrl(`/user/modules/${moduleId}`), { progress });
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'updateModuleProgress', moduleId });
      throw error;
    }
  }

  /**
   * Fetch current daily quest
   */
  static async getCurrentQuest(): Promise<DailyQuest | null> {
    try {
      const response = await api.get<{ quest: DailyQuest | null }>(buildApiUrl('/user/quest'));
      if ((response.data as any).data) return (response.data as any).data;
      return response.data.quest;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        return null;
      }
      logger.error('ApiClient', error, { operation: 'getCurrentQuest' });
      throw error;
    }
  }

  /**
   * Complete current daily quest
   */
  static async completeQuest(): Promise<void> {
    try {
      await api.post(buildApiUrl('/user/quest/complete'));
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'completeQuest' });
      throw error;
    }
  }

  /**
   * Sync all user data with backend
   */
  static async syncUserData(): Promise<{
    progress: Record<string, UserProgress>;
    statistics: UserStatistics;
    modules: LearningModule[];
    quest: DailyQuest | null;
  }> {
    try {
      const response = await api.get<any>(buildApiUrl('/user/sync'));
      const data = response.data.data || response.data;
      
      return {
        progress: (data.levelProgress || []).reduce((acc: any, p: any) => {
          acc[p.levelId] = p;
          return acc;
        }, {}),
        statistics: data.statistics,
        modules: data.moduleProgress || [],
        quest: data.activeQuests?.[0] || null,
      };
    } catch (error) {
      logger.error('ApiClient', error, { operation: 'syncUserData' });
      throw error;
    }
  }
}