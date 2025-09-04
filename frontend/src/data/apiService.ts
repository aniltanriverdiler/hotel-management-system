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
        // Only redirect for protected requests
        if (requireAuth) {
          const { authHelpers } = await import('@/utils/auth');
          authHelpers.clearAuth();
          window.location.href = '/auth/login';
        }
        // Check if this is a login request for better error message
        if (endpoint === '/auth/login') {
          throw new Error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        }
        throw new Error('Yetkisiz - Lütfen tekrar giriş yapın');
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
      
      throw new Error(`HTTP hatası! durum: ${response.status}`);
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
  // Get all hotels with optional filtering and pagination (public endpoint)
  getAll: (params: { city?: string; page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.city) searchParams.append('city', params.city);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/hotels?${queryString}` : '/hotels';
    return apiRequest<any[]>(endpoint, {}, false);
  },
  
  // Get hotel by ID (public endpoint)
  getById: (id: number) => apiRequest<any>(`/hotels/${id}`, {}, false),
  
  // Get cities list (public endpoint)
  getCities: () => apiRequest<string[]>('/hotels/cities/list', {}, false),
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
  
  // Update reservation status
  updateStatus: (id: number, status: string) =>
    apiRequest<any>(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
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

// Review API functions
export const reviewAPI = {
  // Get reviews for a hotel
  getByHotelId: (hotelId: number) => 
    apiRequest<any[]>(`/reviews/hotel/${hotelId}`, {}, false),
  
  // Create new review
  create: (reviewData: any) =>
    apiRequest<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),
  
  // Update review
  update: (id: number, updateData: any) =>
    apiRequest<any>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
  
  // Delete review
  delete: (id: number) =>
    apiRequest<any>(`/reviews/${id}`, {
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
  // Get hotel images
  getByHotelId: (hotelId: number) => 
    apiRequest<any>(`/images/${hotelId}`, {}, false),
  
  // Upload main image
  uploadMain: (hotelId: number, formData: FormData) =>
    apiRequest<any>(`/images/${hotelId}/main`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    }),
  
  // Upload gallery images
  uploadGallery: (hotelId: number, formData: FormData) =>
    apiRequest<any>(`/images/${hotelId}/gallery`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    }),
  
  // Delete main image
  deleteMain: (hotelId: number) =>
    apiRequest<any>(`/images/${hotelId}/main`, {
      method: 'DELETE',
    }),
  
  // Delete gallery image
  deleteGallery: (imageId: number) =>
    apiRequest<any>(`/images/gallery/${imageId}`, {
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
  return 'Beklenmeyen bir hata oluştu';
};

// Export all APIs
export default {
  auth: authAPI,
  hotel: hotelAPI,
  room: roomAPI,
  reservation: reservationAPI,
  user: userAPI,
  review: reviewAPI,
  chat: chatAPI,
  message: messageAPI,
  image: imageAPI,
};
