import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

export const useRenewLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId: number): Promise<LoanResponse> => {
      const { data } = await apiClient.post(`/loans/${loanId}/renew`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-loans'] });
    },
  });
};
