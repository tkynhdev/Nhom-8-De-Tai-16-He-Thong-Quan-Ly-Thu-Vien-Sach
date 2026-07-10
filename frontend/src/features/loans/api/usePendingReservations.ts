import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

export interface AdminReservationData {
  id: number;
  bookId: number;
  bookTitle: string;
  reservationDate: string;
  status: string;
}

export const usePendingReservations = () => {
  return useQuery({
    queryKey: ['admin_pending_reservations'],
    queryFn: async (): Promise<AdminReservationData[]> => {
      const response = await apiClient.get('/admin/reservations/pending');
      return response.data;
    },
  });
};
