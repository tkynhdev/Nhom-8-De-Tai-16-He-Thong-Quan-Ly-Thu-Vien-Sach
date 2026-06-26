import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

const returnBook = async (loanId: number): Promise<LoanResponse> => {
  const { data } = await apiClient.post(`/loans/${loanId}/return`);
  return data;
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['overdue-loans'] });
      queryClient.invalidateQueries({ queryKey: ['book-copies'] });
      queryClient.invalidateQueries({ queryKey: ['statistics-overview'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
