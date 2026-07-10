import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { BookCopyRequest } from '../../../types/api';

export interface BookCopyData {
  id: number;
  copyCode: string;
  status: string;
  shelfLocation: string;
  bookId: number;
  bookTitle: string;
}

export const useBookCopies = () => {
  return useQuery({
    queryKey: ['admin-book-copies'],
    queryFn: async () => {
      const response = await apiClient.get<BookCopyData[]>('/admin/copies');
      return response.data;
    },
  });
};

export const useCreateBookCopy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BookCopyRequest) => {
      const { data } = await apiClient.post<BookCopyData>('/admin/copies', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-book-copies'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBookCopy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: BookCopyRequest }) => {
      const { data } = await apiClient.put<BookCopyData>(`/admin/copies/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-book-copies'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useDeleteBookCopy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/copies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-book-copies'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
