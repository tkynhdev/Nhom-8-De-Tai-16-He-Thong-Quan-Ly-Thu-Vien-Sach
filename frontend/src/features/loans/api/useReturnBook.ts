import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

export const useReturnBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId: number) => {
      const response = await apiClient.post(`/admin/loans/${loanId}/return`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-active-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin_pending_reservations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-book-copies'] });
      queryClient.invalidateQueries({ queryKey: ['statistics-overview'] });
    },
  });
};
