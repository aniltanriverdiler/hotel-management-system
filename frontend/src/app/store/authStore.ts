"use client";

import { create } from "zustand";
import { authHelpers, tokenManager, userManager } from "@/utils/auth";

export interface AuthUser {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  // Extend with any other fields returned by backend
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (params: { token: string; user: AuthUser }) => void;
  logout: () => void;
}

const getInitialAuthState = (): { isLoggedIn: boolean; user: AuthUser | null } => {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, user: null };
  }
  const user = userManager.getUser();
  const isLoggedIn = authHelpers.isLoggedIn();
  return { isLoggedIn, user };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuthState(),

  login: ({ token, user }) => {
    // Persist to localStorage via existing helpers
    tokenManager.setToken(token);
    userManager.setUser(user);
    set({ isLoggedIn: true, user });
  },

  logout: () => {
    authHelpers.clearAuth();
    set({ isLoggedIn: false, user: null });
  },
}));


