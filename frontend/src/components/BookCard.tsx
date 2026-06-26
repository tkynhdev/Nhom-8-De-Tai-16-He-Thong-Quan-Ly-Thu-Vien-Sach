import React from 'react';
import { BookSearchResponse } from '../types/api';

interface BookCardProps {
  book: BookSearchResponse;
  onBorrowClick?: (bookId: number) => void;
  onReserveClick?: (bookId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBorrowClick, onReserveClick }) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Placeholder cover because the current schema does not store image URLs yet. */}
      <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{book.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {book.availableCopies} available
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{book.author}</p>
        <div className="flex justify-between items-center mt-auto pt-4 text-xs text-gray-500">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{book.category}</span>
          <span>ISBN: {book.isbn}</span>
        </div>
        {(onBorrowClick || onReserveClick) && (
          <button
            onClick={() => (isAvailable ? onBorrowClick?.(book.id) : onReserveClick?.(book.id))}
            disabled={isAvailable ? !onBorrowClick : !onReserveClick}
            className={`mt-4 w-full py-2 rounded font-medium transition-colors ${
              isAvailable
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {isAvailable ? 'Borrow Now' : 'Join Waitlist'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
