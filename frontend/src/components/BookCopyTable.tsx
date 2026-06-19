import React from 'react';
import LoanStatusBadge from './LoanStatusBadge';
import { BookCopyData } from '../types/api';

interface BookCopyTableProps {
  copies: BookCopyData[];
  onEditStatus?: (id: number) => void;
  isLoading?: boolean;
}

const BookCopyTable: React.FC<BookCopyTableProps> = ({
  copies,
  onEditStatus,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">Loading copies data...</div>
    );
  }

  if (!copies.length) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        No copies found in the database.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Copy Code
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Book Title
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Shelf Location
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {copies.map((copy) => (
            <tr key={copy.id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {copy.copyCode}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {copy.bookTitle}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {copy.shelfLocation || <span className="text-gray-400 italic">Not assigned</span>}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <LoanStatusBadge status={copy.status} />
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {onEditStatus && (
                  <button
                    onClick={() => onEditStatus(copy.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit Status<span className="sr-only">, {copy.copyCode}</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookCopyTable;
