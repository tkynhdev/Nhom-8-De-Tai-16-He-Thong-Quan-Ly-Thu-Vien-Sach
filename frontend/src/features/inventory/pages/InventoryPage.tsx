import React from 'react';
import BookCopyTable from '../../../components/BookCopyTable';
import { useBookCopies } from '../api/useBookCopies';

const InventoryPage: React.FC = () => {
  const { data: copies = [], isLoading, isError } = useBookCopies();

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
        {isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load book-copy inventory.
          </div>
        ) : (
          <BookCopyTable copies={copies} onEditStatus={handleEditStatus} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
