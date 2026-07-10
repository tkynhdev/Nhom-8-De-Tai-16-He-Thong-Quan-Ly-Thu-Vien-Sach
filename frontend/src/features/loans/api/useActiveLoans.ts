import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

export const useActiveLoans = () => {
  return useQuery({
    queryKey: ['admin-active-loans'],
    queryFn: async (): Promise<LoanResponse[]> => {
      const { data } = await apiClient.get('/admin/loans/active');
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};
