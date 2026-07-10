import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { ReservationResponse } from '../../../types/api';

interface ReserveBookRequest {
  bookId: number;
}

export const useReserveBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ReserveBookRequest) => {
      const response = await apiClient.post('/user/reservations', request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useMyReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    enabled: Boolean(localStorage.getItem('accessToken')),
    queryFn: async () => {
      const { data } = await apiClient.get<ReservationResponse[]>('/user/reservations');
      return data;
    },
  });
};
