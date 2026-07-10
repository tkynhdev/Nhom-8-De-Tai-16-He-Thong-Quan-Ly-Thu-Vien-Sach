import React from 'react';
import LoanStatusBadge from './LoanStatusBadge';
import { BookCopyData } from '../types/api';

interface BookCopyTableProps {
  copies: BookCopyData[];
  onEdit?: (copy: BookCopyData) => void;
  onDelete?: (copy: BookCopyData) => void;
  isLoading?: boolean;
}

const BookCopyTable: React.FC<BookCopyTableProps> = ({
  copies,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="state-card">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <p className="text-sm text-ink-500">Đang tải danh sách bản sao...</p>
      </div>
    );
  }

  if (!copies.length) {
    return (
      <div className="state-card">
        <div className="state-icon text-xl"></div>
        <h3 className="text-lg font-bold text-ink-900">Kho sách trống</h3>
        <p className="mt-1 text-sm text-ink-500">Chưa có bản sao vật lý nào được thêm vào kho.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã vạch / Copy Code</th>
            <th>Tên sách</th>
            <th>Vị trí kệ</th>
            <th>Trạng thái</th>
            <th className="text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {copies.map((copy) => (
            <tr key={copy.id}>
              <td>
                <span className="inline-block rounded-md border border-primary-100 bg-primary-50 px-2 py-1 font-mono text-sm font-bold text-primary-700">
                  {copy.copyCode}
                </span>
              </td>
              <td className="font-bold text-ink-900 line-clamp-2 min-w-[200px]">{copy.bookTitle}</td>
              <td>
                {copy.shelfLocation ? (
                  <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-sm font-semibold text-ink-600">
                    {copy.shelfLocation}
                  </span>
                ) : (
                  <span className="text-sm italic text-ink-500">Chưa xếp kệ</span>
                )}
              </td>
              <td>
                <LoanStatusBadge status={copy.status} />
              </td>
              <td>
                <div className="flex justify-end gap-1.5">
                  {onEdit && (
                    <button
                      className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-ink-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      type="button" onClick={() => onEdit(copy)}
                    >
                       Sửa
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      type="button" onClick={() => onDelete(copy)}
                    >
                      
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookCopyTable;
