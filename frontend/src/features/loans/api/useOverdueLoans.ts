import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { LoanResponse } from '../../../types/api';

const fetchOverdueLoans = async (): Promise<LoanResponse[]> => {
  const { data } = await apiClient.get('/loans/overdue');
  return data;
};

export const useOverdueLoans = () => {
  return useQuery({
    queryKey: ['overdue-loans'],
    queryFn: fetchOverdueLoans,
  });
};
