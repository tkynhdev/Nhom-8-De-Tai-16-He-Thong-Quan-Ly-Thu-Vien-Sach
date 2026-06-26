import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { StatisticsOverviewResponse } from '../../../types/api';

const fetchStatisticsOverview = async (): Promise<StatisticsOverviewResponse> => {
  const { data } = await apiClient.get('/admin/statistics/overview');
  return data;
};

export const useStatisticsOverview = () => {
  return useQuery({
    queryKey: ['statistics-overview'],
    queryFn: fetchStatisticsOverview,
  });
};
