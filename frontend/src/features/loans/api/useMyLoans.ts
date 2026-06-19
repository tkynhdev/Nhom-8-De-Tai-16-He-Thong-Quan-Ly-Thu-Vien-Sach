import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

export const useMyLoans = () => {
  return useQuery({
    queryKey: ['my-loans'],
    queryFn: async (): Promise<LoanResponse[]> => {
      const { data } = await apiClient.get('/loans/my-loans');
      return data;
    },
  });
};

export default useMyLoans;
