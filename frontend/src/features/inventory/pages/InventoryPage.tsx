import React from 'react';
import BookCopyTable from '../../../components/BookCopyTable';
import { BookCopyData } from '../../../types/api';

const mockCopies: BookCopyData[] = [
  {
    id: 1,
    copyCode: 'C-82910',
    status: 'AVAILABLE',
    shelfLocation: 'A1-01',
    bookTitle: 'Spring Boot in Action',
  },
  {
    id: 2,
    copyCode: 'C-82911',
    status: 'LOANED',
    shelfLocation: 'A1-01',
    bookTitle: 'Spring Boot in Action',
  },
  {
    id: 3,
    copyCode: 'C-10294',
    status: 'RESERVED',
    shelfLocation: 'B2-04',
    bookTitle: 'Clean Architecture',
  },
  {
    id: 4,
    copyCode: 'C-10295',
    status: 'LOST',
    shelfLocation: null,
    bookTitle: 'Clean Architecture',
  },
];

const InventoryPage: React.FC = () => {
  const handleEditStatus = (id: number) => {
    console.log('Trigger edit modal for copy ID:', id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold">Inventory Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage physical book copies, tracking their statuses and shelf locations.
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md">
              + Add New Copy
            </button>
          </div>

          <div>
            <select className="px-3 py-1 border border-gray-300 rounded-md bg-white">
              <option>All Statuses</option>
              <option>Available</option>
              <option>Loaned</option>
              <option>Reserved</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <BookCopyTable copies={mockCopies} onEditStatus={handleEditStatus} />
      </div>
    </div>
  );
};

export default InventoryPage;
