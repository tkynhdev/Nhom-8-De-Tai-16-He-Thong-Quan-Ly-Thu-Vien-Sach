import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

interface FineConfigResponse {
  fineRatePerDay: number;
  loanDays: number;
  maxRenewalCount: number;
}

export const useFineConfig = () => {
  return useQuery({
    queryKey: ['fine-config'],
    queryFn: async (): Promise<FineConfigResponse> => {
      const { data } = await apiClient.get('/admin/config/fine-rate');
      return data;
    },
  });
};

export const useUpdateFineConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: FineConfigResponse): Promise<FineConfigResponse> => {
      const { data } = await apiClient.post('/admin/config/fine-rate', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fine-config'] });
    },
  });
};
