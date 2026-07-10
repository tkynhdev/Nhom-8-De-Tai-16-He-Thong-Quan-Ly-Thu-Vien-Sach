import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

export const useBorrowCopy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { memberCode: string; copyCode: string }): Promise<LoanResponse> => {
      const { data } = await apiClient.post('/admin/loans/borrow', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-book-copies'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-active-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin_pending_reservations'] });
      queryClient.invalidateQueries({ queryKey: ['statistics-overview'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useReturnByCopyCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (copyCode: string): Promise<LoanResponse> => {
      const { data } = await apiClient.post('/admin/loans/return', null, { params: { copyCode } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-book-copies'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-active-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin_pending_reservations'] });
      queryClient.invalidateQueries({ queryKey: ['statistics-overview'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
