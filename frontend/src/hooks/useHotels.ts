// Hotel-related hooks isolated in this file
// Includes hotels, rooms, reservations, ratings, chats, messages, images

import { useState, useEffect, useCallback } from 'react';
import { hotelAPI, roomAPI, reservationAPI, userAPI, reviewAPI, chatAPI, messageAPI, imageAPI } from '@/data/apiService';

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAPI<T>(apiCall: () => Promise<T>, dependencies: unknown[] = []): UseAPIState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ...state, refetch: fetchData };
}

export const useMutation = <T, R>(mutationFn: (data: T) => Promise<R>) => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: R | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(async (data: T) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await mutationFn(data);
      setState({ loading: false, error: null, data: result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, [mutationFn]);

  return { ...state, mutate };
};

// Hotel hooks
export const useHotels = (params: { city?: string; page?: number; limit?: number } = {}) => 
  useAPI(() => hotelAPI.getAll(params), [params.city, params.page, params.limit]);
export const useHotel = (id: number) => useAPI(() => hotelAPI.getById(id), [id]);
export const useCities = () => useAPI(() => hotelAPI.getCities());

// Room hooks
export const useRooms = () => useAPI(() => roomAPI.getAll());
export const useRoomsByHotel = (hotelId: number) => useAPI(() => roomAPI.getByHotelId(hotelId), [hotelId]);
export const useRoom = (id: number) => useAPI(() => roomAPI.getById(id), [id]);

// Reservation hooks
export const useReservations = () => useAPI(() => reservationAPI.getAll());
export const useReservationsByUser = (userId: number) => useAPI(() => reservationAPI.getByUserId(userId), [userId]);
export const useReservation = (id: number) => useAPI(() => reservationAPI.getById(id), [id]);

// Mutation hooks (reservation)
export const useCreateReservation = () => useMutation<Record<string, unknown>, unknown>(reservationAPI.create);
export const useUpdateReservationStatus = () =>
  useMutation<{ id: number; status: string }, unknown>(({ id, status }) => reservationAPI.updateStatus(id, status));

// Review hooks
export const useReviewsByHotel = (hotelId: number) => useAPI(() => reviewAPI.getByHotelId(hotelId), [hotelId]);
export const useCreateReview = () => useMutation<Record<string, unknown>, unknown>(reviewAPI.create);
export const useUpdateReview = () =>
  useMutation<{ id: number; data: Record<string, unknown> }, unknown>(({ id, data }) => reviewAPI.update(id, data));
export const useDeleteReview = () => useMutation<number, unknown>(reviewAPI.delete);

// Chat hooks
export const useUserChats = () => useAPI(() => chatAPI.getUserChats());
export const useChat = (id: number) => useAPI(() => chatAPI.getById(id), [id]);
export const useChatMessages = (chatId: number) => useAPI(() => chatAPI.getMessages(chatId), [chatId]);
export const useSendMessage = () =>
  useMutation<{ chatId: number; data: Record<string, unknown> }, unknown>(({ chatId, data }) => chatAPI.sendMessage(chatId, data));

// Message hooks
export const useMessages = () => useAPI(() => messageAPI.getAll());
export const useMessage = (id: number) => useAPI(() => messageAPI.getById(id), [id]);
export const useMarkMessageAsRead = () => useMutation<number, unknown>(messageAPI.markAsRead);

// Image hooks
export const useHotelImages = (hotelId: number) => useAPI(() => imageAPI.getByHotelId(hotelId), [hotelId]);
export const useUploadMainImage = () => useMutation<{ hotelId: number; formData: FormData }, unknown>(({ hotelId, formData }) => imageAPI.uploadMain(hotelId, formData));
export const useUploadGalleryImages = () => useMutation<{ hotelId: number; formData: FormData }, unknown>(({ hotelId, formData }) => imageAPI.uploadGallery(hotelId, formData));
export const useDeleteMainImage = () => useMutation<number, unknown>(imageAPI.deleteMain);
export const useDeleteGalleryImage = () => useMutation<number, unknown>(imageAPI.deleteGallery);

export default {
  useHotels,
  useHotel,
  useCities,
  useRooms,
  useRoomsByHotel,
  useRoom,
  useReservations,
  useReservationsByUser,
  useReservation,
  useCreateReservation,
  useUpdateReservationStatus,
  useReviewsByHotel,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useUserChats,
  useChat,
  useChatMessages,
  useSendMessage,
  useMessages,
  useMessage,
  useMarkMessageAsRead,
  useHotelImages,
  useUploadMainImage,
  useUploadGalleryImages,
  useDeleteMainImage,
  useDeleteGalleryImage,
};


