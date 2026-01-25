import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

export type ChallengeType = 'image' | 'code' | 'copywriting';

export interface Level {
  id: string;
  moduleId: string;
  type: ChallengeType;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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
}

export interface GameState {
  // Current game state
  currentLevelId: string | null;
  lives: number;
  score: number;
  isPlaying: boolean;

  // Progress
  unlockedLevels: string[];
  completedLevels: string[];

  // Actions
  startLevel: (levelId: string) => void;
  endLevel: () => void;
  loseLife: () => void;
  resetLives: () => void;
  unlockLevel: (levelId: string) => void;
  completeLevel: (levelId: string) => void;
  resetProgress: () => void;
}

const initialState = {
  currentLevelId: null,
  lives: 3,
  score: 0,
  isPlaying: false,
  unlockedLevels: ['level_01'], // First level always unlocked
  completedLevels: [],
};

// Custom storage adapter for expo-secure-store
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // Handle error silently
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // Handle error silently
    }
  },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startLevel: (levelId: string) => {
        set({
          currentLevelId: levelId,
          isPlaying: true,
          lives: 3, // Reset lives when starting a level
          score: 0,
        });
      },

      endLevel: () => {
        set({
          currentLevelId: null,
          isPlaying: false,
        });
      },

      loseLife: () => {
        const currentLives = get().lives;
        if (currentLives > 1) {
          set({ lives: currentLives - 1 });
        } else {
          // Game over - reset
          set({
            lives: 3,
            currentLevelId: null,
            isPlaying: false,
          });
        }
      },

      resetLives: () => {
        set({ lives: 3 });
      },

      unlockLevel: (levelId: string) => {
        const unlockedLevels = get().unlockedLevels;
        if (!unlockedLevels.includes(levelId)) {
          set({ unlockedLevels: [...unlockedLevels, levelId] });
        }
      },

      completeLevel: (levelId: string) => {
        const completedLevels = get().completedLevels;
        if (!completedLevels.includes(levelId)) {
          set({ completedLevels: [...completedLevels, levelId] });
        }
      },

      resetProgress: () => {
        set(initialState);
      },
    }),
    {
      name: 'promptpal-game-storage',
      storage: createJSONStorage(() => secureStorage),
      // Add error handling for corrupted storage
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Game store rehydration error:', error);
        }
        // If state is undefined or corrupted, it will use initial state automatically
      },
    }
  )
);
