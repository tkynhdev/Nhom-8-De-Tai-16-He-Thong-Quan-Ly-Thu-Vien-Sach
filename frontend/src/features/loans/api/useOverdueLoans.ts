import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

export const useOverdueLoans = () => {
  return useQuery({
    queryKey: ['admin-overdue-loans'],
    queryFn: async () => {
      const response = await apiClient.get<LoanResponse[]>('/admin/loans/overdue');
      return response.data;
    },
  });
};
