import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { PaginatedResponse, BookSearchResponse } from '../../../types/api';

interface UseBooksParams {
  title?: string;
  author?: string;
  category?: string;
  isbn?: string;
  page?: number;
  size?: number;
}

const fetchBooks = async (
  params: UseBooksParams
): Promise<PaginatedResponse<BookSearchResponse>> => {
  const { data } = await apiClient.get('/books/search', { params });
  return data;
};

export const useBooks = (params: UseBooksParams) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => fetchBooks(params),
  });
};
