import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { BookCopyData } from '../../../types/api';

const fetchBookCopies = async (): Promise<BookCopyData[]> => {
  const { data } = await apiClient.get('/admin/book-copies');
  return data;
};

export const useBookCopies = () => {
  return useQuery({
    queryKey: ['book-copies'],
    queryFn: fetchBookCopies,
  });
};
