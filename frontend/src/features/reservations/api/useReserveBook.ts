import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

interface ReservationRequest {
  bookId: number;
}

const reserveBook = async (payload: ReservationRequest) => {
  const { data } = await apiClient.post('/reservations', payload);
  return data;
};

export const useReserveBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reserveBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
    },
  });
};
