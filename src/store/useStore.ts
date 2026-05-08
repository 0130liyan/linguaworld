import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  level: number;
  expPoints: number;
  learningLanguages: string[];
  streak: number;
  dailyGoal: number;
  createdAt: string;
}

export interface Course {
  id: string;
  language: string;
  languageFlag: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  level: number;
  imageUrl: string;
  lessonCount: number;
  enrolledCount: number;
  tags: string[];
  totalExp: number;
  completedLessons: number;
}

export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  mastery: number;
}

export interface Grammar {
  id: string;
  title: string;
  structure: string;
  explanation: string;
  examples: { sentence: string; meaning: string }[];
  exercises: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface ListeningItem {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  translation: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface SpeakingItem {
  id: string;
  phrase: string;
  translation: string;
  pronunciation: string;
  tips: string;
}

export interface Progress {
  lessonId: string;
  completed: boolean;
  score: number;
  lastStudied: string;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  expReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userAvatar: string;
  userName: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: string;
  language: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  progress: Record<string, Progress>;
  achievements: Achievement[];
  communityPosts: CommunityPost[];
  favorites: string[];
  settings: {
    theme: 'light' | 'dark';
    dailyGoal: number;
    notifications: boolean;
    soundEnabled: boolean;
  };
  
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProgress: (lessonId: string, progress: Partial<Progress>) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  addExp: (amount: number) => void;
  setCommunityPosts: (posts: CommunityPost[]) => void;
  toggleLike: (postId: string) => void;
  addPost: (post: CommunityPost) => void;
  toggleFavorite: (courseId: string) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  resetDailyProgress: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      progress: {},
      achievements: [],
      communityPosts: [],
      favorites: [],
      settings: {
        theme: 'light',
        dailyGoal: 50,
        notifications: true,
        soundEnabled: true,
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        const storedUsers = JSON.parse(localStorage.getItem('linguaworld_users') || '[]');
        const user = storedUsers.find((u: any) => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...safeUser } = user;
          set({ user: safeUser, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (email, username, password) => {
        const storedUsers = JSON.parse(localStorage.getItem('linguaworld_users') || '[]');
        if (storedUsers.some((u: any) => u.email === email)) {
          return false;
        }
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          level: 1,
          expPoints: 0,
          learningLanguages: [],
          streak: 0,
          dailyGoal: 50,
          createdAt: new Date().toISOString(),
        };
        storedUsers.push({ ...newUser, password });
        localStorage.setItem('linguaworld_users', JSON.stringify(storedUsers));
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProgress: (lessonId, progressUpdate) => {
        const current = get().progress[lessonId] || {
          lessonId,
          completed: false,
          score: 0,
          lastStudied: '',
          xpEarned: 0,
        };
        set((state) => ({
          progress: {
            ...state.progress,
            [lessonId]: { ...current, ...progressUpdate, lastStudied: new Date().toISOString() },
          },
        }));
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
          ),
        }));
      },

      updateAchievementProgress: (achievementId, progress) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId ? { ...a, progress } : a
          ),
        }));
      },

      addExp: (amount) => {
        const user = get().user;
        if (!user) return;
        const newExp = user.expPoints + amount;
        let newLevel = user.level;
        const expForNextLevel = user.level * 500;
        if (newExp >= expForNextLevel) {
          newLevel = Math.floor(newExp / 500) + 1;
        }
        set((state) => ({
          user: { ...state.user!, expPoints: newExp, level: newLevel },
        }));
      },

      setCommunityPosts: (posts) => set({ communityPosts: posts }),

      toggleLike: (postId) => {
        set((state) => ({
          communityPosts: state.communityPosts.map((p) =>
            p.id === postId
              ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
              : p
          ),
        }));
      },

      addPost: (post) => set((state) => ({
        communityPosts: [post, ...state.communityPosts]
      })),

      toggleFavorite: (courseId) => {
        set((state) => ({
          favorites: state.favorites.includes(courseId)
            ? state.favorites.filter((id) => id !== courseId)
            : [...state.favorites, courseId],
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      resetDailyProgress: () => {
        // Reset daily streak logic can be implemented here
      },
    }),
    {
      name: 'linguaworld-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        progress: state.progress,
        achievements: state.achievements,
        favorites: state.favorites,
        settings: state.settings,
      }),
    }
  )
);
