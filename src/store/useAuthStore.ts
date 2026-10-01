// 🎯 File: src/store/useAuthStore.ts
import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  [key: string]: any; // Allows extending with extra fields (like name, role, etc.) without breaking types
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUserProfile: (user: User) => void;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  initializeSession: () => void;
}

const STORAGE_KEY = "app_auth_credentials";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  // 🔑 Action 1: Set token globally
  setToken: (token: string) => {
    set({ accessToken: token });
  },

  // 👤 Action 2: Set user profile globally
  setUserProfile: (user: User) => {
    set({ user, isLoading: false });
  },

  // Set both and persist to localStorage
  setSession: (user: User, token: string) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ userProfile: user, token }),
      );
    } catch (error) {
      console.error("Failed to save session to localStorage:", error);
    }
    set({ user, accessToken: token, isLoading: false });
  },

  // Completely wipe storage and state on logout
  clearSession: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear localStorage session:", error);
    }
    set({ user: null, accessToken: null, isLoading: false });
  },

  // Rehydrate session from localStorage on app boot
  initializeSession: () => {
    try {
      const secureData = localStorage.getItem(STORAGE_KEY);
      if (secureData) {
        const { token, userProfile } = JSON.parse(secureData);

        if (userProfile && userProfile.email) {
          set({ user: userProfile, accessToken: token, isLoading: false });
          console.log("✅ Session rehydrated successfully.");
        } else {
          console.warn("⚠️ Discarding stale cache. Clearing storage...");
          localStorage.removeItem(STORAGE_KEY);
          set({ user: null, accessToken: null, isLoading: false });
        }
        return;
      }
    } catch (error) {
      console.error("Failed to restore browser session:", error);
    }
    set({ user: null, accessToken: null, isLoading: false });
  },
}));
