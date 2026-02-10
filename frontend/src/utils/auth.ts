// Authentication utility functions
// This file handles token management and authentication state

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Token management functions
export const tokenManager = {
  // Save token to localStorage
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Remove token from localStorage
  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Check if token exists
  hasToken: (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(TOKEN_KEY);
    }
    return false;
  },
};

// User data management functions
export const userManager = {
  // Save user data to localStorage
  setUser: (user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Get user data from localStorage
  getUser: (): any | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Remove user data from localStorage
  removeUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return tokenManager.hasToken() && !!userManager.getUser();
  },
};

// Authentication helper functions
export const authHelpers = {
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    if (typeof window !== "undefined") {
      const hasToken =
        !!localStorage.getItem("token") || tokenManager.hasToken();
      const hasUser = !!userManager.getUser();
      return hasToken && hasUser;
    }
    return false;
  },

  // Clear all authentication data
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    tokenManager.removeToken();
    userManager.removeUser();
  },

  // Get authorization header for API requests
  getAuthHeader: (): { Authorization: string } | {} => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || tokenManager.getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  },

  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const user = userManager.getUser();
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    return authHelpers.hasRole("ADMIN");
  },

  // Check if user is hotel owner
  isHotelOwner: (): boolean => {
    return authHelpers.hasRole("HOTEL_OWNER");
  },

  // Check if user is support
  isSupport: (): boolean => {
    return authHelpers.hasRole("SUPPORT");
  },

  // Check if user is regular user
  isUser: (): boolean => {
    return authHelpers.hasRole("USER");
  },
};

// API request interceptor to add auth headers
export const withAuth = (options: RequestInit = {}): RequestInit => {
  const authHeader = authHelpers.getAuthHeader();
  return {
    ...options,
    headers: {
      ...options.headers,
      ...authHeader,
    },
  };
};
