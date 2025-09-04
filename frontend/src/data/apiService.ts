// API Service for fetching data from backend server
// This file handles all HTTP requests to the backend API

import { withAuth } from '@/utils/auth';

const API_BASE_URL = 'http://localhost:3000/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = requireAuth ? withAuth(options) : options;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...requestOptions.headers,
      },
      ...requestOptions,
    });

    if (!response.ok) {
      // Handle different HTTP status codes
      if (response.status === 401) {
        // Clear auth data and redirect to login
        const { authHelpers } = await import('@/utils/auth');
        authHelpers.clearAuth();
        window.location.href = '/auth/login';
        throw new Error('Unauthorized - Please login again');
      }
      
      if (response.status === 409) {
        // Conflict - usually means email already exists
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Bu email adresi zaten kullanılıyor');
      }
      
      if (response.status === 400) {
        // Bad Request - validation errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Geçersiz veri gönderildi');
      }
      
      if (response.status === 500) {
        throw new Error('Sunucu hatası - Lütfen daha sonra tekrar deneyin');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle backend response format: {success: true, data: [...]}
    if (result.success && result.data !== undefined) {
      return result.data;
    }
    
    return result;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Hotel API functions
export const hotelAPI = {
  // Get all hotels (public endpoint)
  getAll: () => apiRequest<any[]>('/hotels', {}, false),
  
  // Get hotel by ID (public endpoint)
  getById: (id: number) => apiRequest<any>(`/hotels/${id}`, {}, false),
  
  // Get hotels by location (public endpoint)
  getByLocation: (location: string) => 
    apiRequest<any[]>(`/hotels?location=${encodeURIComponent(location)}`, {}, false),
  
  // Get hotels by category (public endpoint)
  getByCategory: (category: string) => 
    apiRequest<any[]>(`/hotels?category=${encodeURIComponent(category)}`, {}, false),
  
  // Search hotels (public endpoint)
  search: (query: string) => 
    apiRequest<any[]>(`/hotels/search?q=${encodeURIComponent(query)}`, {}, false),
};

// Room API functions
export const roomAPI = {
  // Get all rooms (public endpoint)
  getAll: () => apiRequest<any[]>('/rooms', {}, false),
  
  // Get rooms by hotel ID (public endpoint)
  getByHotelId: (hotelId: number) => 
    apiRequest<any[]>(`/rooms?hotelId=${hotelId}`, {}, false),
  
  // Get room by ID (public endpoint)
  getById: (id: number) => apiRequest<any>(`/rooms/${id}`, {}, false),
  
  // Check room availability (public endpoint)
  checkAvailability: (roomId: number, checkIn: string, checkOut: string) =>
    apiRequest<any>(`/rooms/${roomId}/availability`, {
      method: 'POST',
      body: JSON.stringify({ checkIn, checkOut }),
    }, false),
};

// Reservation API functions
export const reservationAPI = {
  // Get all reservations
  getAll: () => apiRequest<any[]>('/reservations'),
  
  // Get reservations by user ID
  getByUserId: (userId: number) => 
    apiRequest<any[]>(`/reservations?userId=${userId}`),
  
  // Get reservation by ID
  getById: (id: number) => apiRequest<any>(`/reservations/${id}`),
  
  // Create new reservation
  create: (reservationData: any) =>
    apiRequest<any>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    }),
  
  // Update reservation
  update: (id: number, updateData: any) =>
    apiRequest<any>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
  
  // Cancel reservation
  cancel: (id: number) =>
    apiRequest<any>(`/reservations/${id}/cancel`, {
      method: 'PUT',
    }),
};

// Authentication API functions
export const authAPI = {
  // Login user
  login: (credentials: { email: string; password: string }) =>
    apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false), // Don't require auth for login
  
  // Register user
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role?: string;
  }) =>
    apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false), // Don't require auth for register
  
  // Logout user
  logout: () =>
    apiRequest<any>('/auth/logout', {
      method: 'POST',
    }),
  
  // Refresh token
  refreshToken: () =>
    apiRequest<any>('/auth/refresh', {
      method: 'POST',
    }),
  
  // Verify token
  verifyToken: () =>
    apiRequest<any>('/auth/verify'),
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: () => apiRequest<any>('/users/profile'),
  
  // Update user profile
  updateProfile: (userData: any) =>
    apiRequest<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  // Get user by ID
  getById: (id: number) => apiRequest<any>(`/users/${id}`),
};

// Rating API functions
export const ratingAPI = {
  // Get ratings for a hotel
  getByHotelId: (hotelId: number) => 
    apiRequest<any[]>(`/ratings?hotelId=${hotelId}`),
  
  // Create new rating
  create: (ratingData: any) =>
    apiRequest<any>('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    }),
  
  // Update rating
  update: (id: number, updateData: any) =>
    apiRequest<any>(`/ratings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
  
  // Delete rating
  delete: (id: number) =>
    apiRequest<any>(`/ratings/${id}`, {
      method: 'DELETE',
    }),
};

// Chat API functions
export const chatAPI = {
  // Start or find direct chat between two users
  startDirectChat: (targetUserId: number) =>
    apiRequest<any>('/chats/start', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    }),
  
  // Verify user participation in chat
  verifyParticipation: (chatId: number) => 
    apiRequest<any>(`/chats/${chatId}/verify`),
  
  // Get other participants in chat
  getCounterparts: (chatId: number) =>
    apiRequest<any>(`/chats/${chatId}/counterparts`),
  
  // Get chat messages (moved to correct endpoint)
  getMessages: (chatId: number) => 
    apiRequest<any[]>(`/messages/${chatId}/messages`),
  
  // Send message (moved to correct endpoint)
  sendMessage: (chatId: number, messageData: any) =>
    apiRequest<any>(`/messages/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
};

// Message API functions
export const messageAPI = {
  // Delete message
  deleteMessage: (messageId: number) =>
    apiRequest<any>(`/messages/${messageId}`, {
      method: 'DELETE',
    }),
  
  // Get chat messages (alias for chatAPI.getMessages)
  getChatMessages: (chatId: number) => 
    apiRequest<any[]>(`/messages/${chatId}/messages`),
  
  // Send message to chat (alias for chatAPI.sendMessage)
  sendToChat: (chatId: number, messageData: any) =>
    apiRequest<any>(`/messages/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
};

// Image API functions
export const imageAPI = {
  // Upload image
  upload: (formData: FormData) =>
    apiRequest<any>('/images/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    }),
  
  // Get image by ID
  getById: (id: number) => apiRequest<any>(`/images/${id}`),
  
  // Delete image
  delete: (id: number) =>
    apiRequest<any>(`/images/${id}`, {
      method: 'DELETE',
    }),
};

// Error handling utility
export const handleAPIError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Export all APIs
export default {
  auth: authAPI,
  hotel: hotelAPI,
  room: roomAPI,
  reservation: reservationAPI,
  user: userAPI,
  rating: ratingAPI,
  chat: chatAPI,
  message: messageAPI,
  image: imageAPI,
};
