import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

export const useReturnLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId: number): Promise<LoanResponse> => {
      const { data } = await apiClient.post(`/loans/${loanId}/return`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
