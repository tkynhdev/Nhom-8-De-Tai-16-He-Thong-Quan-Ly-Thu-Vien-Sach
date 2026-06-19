import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBooks } from '../../books/api/useBooks';
import { useBorrowBook } from '../../loans/api/useBorrowBook';
import BookCard from '../../../components/BookCard';

interface SearchFormInputs {
  keyword: string;
  category: string;
}

const BookSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState({ title: '', category: '', page: 0, size: 12 });
  const { register, handleSubmit } = useForm<SearchFormInputs>();

  const { data: booksData, isLoading, isError } = useBooks(searchParams);
  const borrowBookMutation = useBorrowBook();

  const onSubmit = (data: SearchFormInputs) => {
    setSearchParams((prev) => ({
      ...prev,
      title: data.keyword,
      category: data.category,
      page: 0,
    }));
  };

  const handleBorrow = (bookId: number) => {
    if (window.confirm('Are you sure you want to borrow this book?')) {
      borrowBookMutation.mutate(
        { bookId },
        {
          onSuccess: () => alert('Book borrowed successfully!'),
          onError: (error: any) => alert(error.response?.data?.message || 'Failed to borrow book'),
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              {...register('keyword')}
              type="text"
              placeholder="Search by title or author..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              {...register('category')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-slate-800 text-white font-medium rounded-md hover:bg-slate-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="text-center py-10 text-gray-500 animate-pulse">Searching books...</div>
      )}

      {isError && (
        <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">
          Error loading books. Please try again.
        </div>
      )}

      {!isLoading && !isError && booksData?.content.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          No books found matching your criteria.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {booksData?.content.map((book) => (
          <BookCard key={book.id} book={book} onActionClick={handleBorrow} />
        ))}
      </div>

      {booksData && booksData.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            disabled={booksData.number === 0}
            onClick={() => setSearchParams((prev) => ({ ...prev, page: prev.page - 1 }))}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {booksData.number + 1} of {booksData.totalPages}
          </span>
          <button
            disabled={booksData.number >= booksData.totalPages - 1}
            onClick={() => setSearchParams((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookSearchPage;
