import React, { FormEvent, useMemo, useState } from 'react';
import BookCopyTable from '../../../components/BookCopyTable';
import { BookCopyData, BookCopyRequest } from '../../../types/api';
import { useBooks } from '../../books/api/useBooks';
import {
  useBookCopies,
  useCreateBookCopy,
  useDeleteBookCopy,
  useUpdateBookCopy,
} from '../api/useBookCopies';

const emptyForm: BookCopyRequest = {
  bookId: 0,
  copyCode: '',
  status: 'AVAILABLE',
  shelfLocation: '',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Có sẵn',
  LOANED: 'Đã mượn',
  RESERVED: 'Đặt trước',
  LOST: 'Mất sách',
};

const copyStatuses: BookCopyRequest['status'][] = ['AVAILABLE', 'LOANED', 'RESERVED', 'LOST'];

const InventoryPage: React.FC = () => {
  const { data: copies = [], isLoading, isError } = useBookCopies();
  const { data: booksData } = useBooks({ page: 0, size: 200 });
  const createCopy = useCreateBookCopy();
  const updateCopy = useUpdateBookCopy();
  const deleteCopy = useDeleteBookCopy();
  
  const books = useMemo(() => booksData?.content ?? [], [booksData]);
  const [editingCopy, setEditingCopy] = useState<BookCopyData | null>(null);
  const [form, setForm] = useState<BookCopyRequest>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setEditingCopy(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      bookId: Number(form.bookId),
      copyCode: form.copyCode.trim(),
      shelfLocation: form.shelfLocation?.trim(),
    };

    if (editingCopy) {
      updateCopy.mutate({ id: editingCopy.id, payload }, { onSuccess: resetForm });
    } else {
      createCopy.mutate(payload, { onSuccess: resetForm });
    }
  };

  const startEdit = (copy: BookCopyData) => {
    setEditingCopy(copy);
    setForm({
      bookId: copy.bookId ?? 0,
      copyCode: copy.copyCode,
      status: copy.status as BookCopyRequest['status'],
      shelfLocation: copy.shelfLocation ?? '',
    });
    setShowForm(true);
  };

  const handleDelete = (copy: BookCopyData) => {
    if (!window.confirm(`Xoá bản sao mã ${copy.copyCode}?\nHành động này không thể hoàn tác.`)) return;
    deleteCopy.mutate(copy.id);
  };

  const errorMsg = (createCopy.error || updateCopy.error || deleteCopy.error) as any;
  const errorMessage = errorMsg?.response?.data?.message;

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Quản lý kho</p>
            <h2 className="panel-title">Bản sao vật lý</h2>
            <p className="panel-description">Quản lý mã vạch từng cuốn sách, vị trí kệ và trạng thái lưu thông.</p>
          </div>
          <button
            className="btn-primary shrink-0"
            onClick={() => { setShowForm(true); setEditingCopy(null); setForm(emptyForm); }}
          >
            + Nhập sách vào kho
          </button>
        </div>
      </section>

      {/* Form */}
      {showForm && (
        <section className="panel border-primary-200 bg-primary-50/30">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="section-kicker">{editingCopy ? 'Chỉnh sửa' : 'Nhập kho'}</p>
              <h3 className="panel-title">{editingCopy ? `Sửa: ${editingCopy.copyCode}` : 'Thêm bản sao mới'}</h3>
            </div>
            <button className="text-ink-400 hover:text-ink-700" onClick={resetForm}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="grid grid-cols-1 gap-4 lg:grid-cols-4" onSubmit={handleSubmit}>
            <div className="lg:col-span-2">
              <label className="form-label"> Chọn sách gốc</label>
              <select
                className="input-field"
                value={form.bookId}
                onChange={(e) => setForm({ ...form, bookId: Number(e.target.value) })}
                required
              >
                <option value={0}>-- Vui lòng chọn sách --</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label"> Mã vạch / Copy Code</label>
              <input
                className="input-field"
                placeholder="VD: BOOK-001"
                value={form.copyCode}
                onChange={(e) => setForm({ ...form, copyCode: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label"> Vị trí kệ</label>
              <input
                className="input-field"
                placeholder="VD: Kệ A1-Tầng 2"
                value={form.shelfLocation}
                onChange={(e) => setForm({ ...form, shelfLocation: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label"> Trạng thái</label>
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as BookCopyRequest['status'] })}
              >
                {copyStatuses.map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-4 mt-2">
              <button className="btn-primary" type="submit" disabled={!form.bookId || createCopy.isPending || updateCopy.isPending}>
                {createCopy.isPending || updateCopy.isPending
                  ? 'Đang lưu...'
                  : editingCopy ? ' Cập nhật bản sao' : '+ Tạo bản sao'}
              </button>
              <button className="btn-secondary" type="button" onClick={resetForm}>Huỷ</button>
              {errorMessage && <span className="text-sm font-semibold text-red-600"> {errorMessage}</span>}
            </div>
          </form>
        </section>
      )}

      {/* Table */}
      {isError ? (
        <div className="panel text-center text-red-600"> Lỗi: Không thể tải danh sách bản sao.</div>
      ) : (
        <BookCopyTable
          copies={copies}
          isLoading={isLoading}
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default InventoryPage;
