import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

export interface StatisticsOverview {
  totalActiveLoans: number;
  totalOverdue: number;
  availableCopies: number;
  activeMembers: number;
  popularBooks: string;
  popularBookChart: Array<{
    title: string;
    borrowCount: number;
  }>;
  monthlyFinesCollected: number;
}

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics-overview'],
    queryFn: async (): Promise<StatisticsOverview> => {
      const response = await apiClient.get('/admin/statistics/overview');
      return response.data;
    },
  });
};
