import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phone: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiClient.put('/member/profile', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries that might depend on user data if any
      // Since user is from auth context, we might need to refresh auth token or reload page
      // But for now just invalidating
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};
