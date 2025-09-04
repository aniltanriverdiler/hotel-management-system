// Hotel-related hooks isolated in this file
// Includes hotels, rooms, reservations, ratings, chats, messages, images

import { useState, useEffect, useCallback } from 'react';
import { hotelAPI, roomAPI, reservationAPI, userAPI, ratingAPI, chatAPI, messageAPI, imageAPI } from '@/data/apiService';

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
export const useHotels = () => useAPI(() => hotelAPI.getAll());
export const useHotel = (id: number) => useAPI(() => hotelAPI.getById(id), [id]);
export const useHotelsByLocation = (location: string) => useAPI(() => hotelAPI.getByLocation(location), [location]);
export const useHotelsByCategory = (category: string) => useAPI(() => hotelAPI.getByCategory(category), [category]);
export const useHotelSearch = (query: string) => useAPI(() => hotelAPI.search(query), [query]);

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
export const useUpdateReservation = () =>
  useMutation<{ id: number; data: Record<string, unknown> }, unknown>(({ id, data }) => reservationAPI.update(id, data));
export const useCancelReservation = () => useMutation<number, unknown>(reservationAPI.cancel);

// Rating hooks
export const useRatingsByHotel = (hotelId: number) => useAPI(() => ratingAPI.getByHotelId(hotelId), [hotelId]);
export const useCreateRating = () => useMutation<Record<string, unknown>, unknown>(ratingAPI.create);
export const useUpdateRating = () =>
  useMutation<{ id: number; data: Record<string, unknown> }, unknown>(({ id, data }) => ratingAPI.update(id, data));
export const useDeleteRating = () => useMutation<number, unknown>(ratingAPI.delete);

// Chat hooks
export const useStartDirectChat = () => 
  useMutation<number, unknown>((targetUserId: number) => chatAPI.startDirectChat(targetUserId));
export const useVerifyParticipation = (chatId: number) => 
  useAPI(() => chatAPI.verifyParticipation(chatId), [chatId]);
export const useCounterparts = (chatId: number) => 
  useAPI(() => chatAPI.getCounterparts(chatId), [chatId]);
export const useChatMessages = (chatId: number) => 
  useAPI(() => chatAPI.getMessages(chatId), [chatId]);
export const useSendMessage = () =>
  useMutation<{ chatId: number; data: Record<string, unknown> }, unknown>(({ chatId, data }) => chatAPI.sendMessage(chatId, data));

// Message hooks
export const useDeleteMessage = () => useMutation<number, unknown>(messageAPI.deleteMessage);

// Image hooks
export const useUploadImage = () => useMutation<FormData, unknown>(imageAPI.upload);
export const useImage = (id: number) => useAPI(() => imageAPI.getById(id), [id]);
export const useDeleteImage = () => useMutation<number, unknown>(imageAPI.delete);

export default {
  useHotels,
  useHotel,
  useHotelsByLocation,
  useHotelsByCategory,
  useHotelSearch,
  useRooms,
  useRoomsByHotel,
  useRoom,
  useReservations,
  useReservationsByUser,
  useReservation,
  useCreateReservation,
  useUpdateReservation,
  useCancelReservation,
  useRatingsByHotel,
  useCreateRating,
  useUpdateRating,
  useDeleteRating,
  useStartDirectChat,
  useVerifyParticipation,
  useCounterparts,
  useChatMessages,
  useSendMessage,
  useDeleteMessage,
  useUploadImage,
  useImage,
  useDeleteImage,
};


