import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { BorrowRequest, LoanResponse } from '../../../types/api';

export const borrowBook = async (payload: { bookId: number }): Promise<LoanResponse> => {
  const { data } = await apiClient.post('/loans/borrow', payload);
  return data;
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: borrowBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
    },
  });
};
