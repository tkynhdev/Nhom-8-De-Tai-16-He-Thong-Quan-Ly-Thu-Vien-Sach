import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { MemberRequest, MemberResponse } from '../../../types/api';

export const useMembers = () => {
  return useQuery({
    queryKey: ['admin-members'],
    queryFn: async (): Promise<MemberResponse[]> => {
      const { data } = await apiClient.get('/admin/members');
      return data;
    },
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MemberRequest): Promise<MemberResponse> => {
      const { data } = await apiClient.post('/admin/members', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: MemberRequest }): Promise<MemberResponse> => {
      const { data } = await apiClient.put(`/admin/members/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/admin/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
    },
  });
};
