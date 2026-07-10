import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useBooks } from '../../books/api/useBooks';
import { useBorrowBook } from '../../loans/api/useBorrowBook';
import { useMyReservations, useReserveBook } from '../../loans/api/useReserveBook';
import BookCard from '../../../components/BookCard';

interface SearchFormInputs {
  keyword: string;
  category: string;
}

const CATEGORIES = [
  'Khoa học - Kỹ thuật',
  'Văn học - Tiểu thuyết',
  'Kinh tế - Quản trị',
  'Lịch sử - Xã hội',
  'Thiếu nhi',
  'Tâm lý - Kỹ năng sống',
  'Ngoại ngữ',
  'Pháp luật',
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'title_asc', label: 'Tên A → Z' },
  { value: 'title_desc', label: 'Tên Z → A' },
  { value: 'available', label: 'Còn sách trước' },
];

const BookSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState({ title: '', category: '', page: 0, size: 50 });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available'>('all');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const { register, handleSubmit, reset } = useForm<SearchFormInputs>();
  const { data: booksData, isLoading, isError } = useBooks(searchParams);
  const { data: reservations = [] } = useMyReservations();
  const borrowBookMutation = useBorrowBook();
  const reserveBookMutation = useReserveBook();

  const reservedBookIds = new Set(
    reservations.filter((r) => r.status === 'PENDING').map((r) => r.bookId)
  );
  const isMutating = borrowBookMutation.isPending || reserveBookMutation.isPending;

  let books = booksData?.content ?? [];

  // Lọc theo trạng thái
  if (statusFilter === 'available') {
    books = books.filter((b) => b.availableCopies > 0);
  }

  // Sắp xếp
  if (sortBy === 'title_asc') books = [...books].sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === 'title_desc') books = [...books].sort((a, b) => b.title.localeCompare(a.title));
  if (sortBy === 'available') books = [...books].sort((a, b) => b.availableCopies - a.availableCopies);

  const errorMessage = (error: any, fallback: string) => {
    const data = error?.response?.data;
    return data?.message || (typeof data === 'string' ? data : fallback);
  };

  const onSubmit = (data: SearchFormInputs) => {
    setSearchParams({ title: data.keyword.trim(), category: selectedCategory || data.category.trim(), page: 0, size: 50 });
    setMessage('');
  };

  const handleCategoryClick = (cat: string) => {
    const next = selectedCategory === cat ? '' : cat;
    setSelectedCategory(next);
    setSearchParams((prev) => ({ ...prev, category: next }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSortBy('default');
    setStatusFilter('all');
    setSearchParams({ title: '', category: '', page: 0, size: 50 });
    reset();
  };

  const handleBorrow = (bookId: number) => {
    if (!localStorage.getItem('accessToken')) { window.location.href = '/login'; return; }
    setMessage('');
    borrowBookMutation.mutate(
      { bookId },
      {
        onSuccess: () => { setMessageType('success'); setMessage('Mượn sách thành công! Hạn trả sau 14 ngày.'); },
        onError: (err: any) => { setMessageType('error'); setMessage(errorMessage(err, 'Chưa thể mượn sách này.')); },
      }
    );
  };

  const handleReserve = (bookId: number) => {
    if (!localStorage.getItem('accessToken')) { window.location.href = '/login'; return; }
    setMessage('');
    reserveBookMutation.mutate(
      { bookId },
      {
        onSuccess: () => { setMessageType('success'); setMessage('Đặt chỗ thành công! Chúng tôi sẽ thông báo khi sách có sẵn.'); },
        onError: (err: any) => { setMessageType('error'); setMessage(errorMessage(err, 'Chưa thể đặt chỗ sách này.')); },
      }
    );
  };

  return (
    <div className="page-stack">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="font-semibold text-ink-900">Danh sách sách</span>
      </nav>

      {/* Header */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Kho sách</p>
            <h1 className="panel-title">Danh sách sách thư viện</h1>
            <p className="panel-description">Tìm kiếm, lọc theo danh mục và mượn sách trực tiếp.</p>
          </div>
          <span className="tag tag-muted shrink-0">{booksData?.totalElements ?? 0} đầu sách</span>
        </div>

        {/* Search form */}
        <form className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="input-field pl-9"
              placeholder="Tên sách, tác giả, từ khoá..."
              {...register('keyword')}
            />
          </div>
          <button className="btn-primary" type="submit">Tìm kiếm</button>
        </form>
      </section>

      {/* Thông báo */}
      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${messageType === 'success' ? 'border-accent-100 bg-accent-50 text-accent-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Main layout: sidebar + grid */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

        {/* ===== SIDEBAR BỘ LỌC ===== */}
        <aside className="w-full shrink-0 lg:w-60 xl:w-64">
          <div className="panel sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">Bộ lọc</h2>
              <button onClick={handleResetFilters} className="text-xs font-semibold text-primary-600 hover:underline">
                Đặt lại
              </button>
            </div>

            {/* Trạng thái */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-500">Trạng thái</p>
              <div className="space-y-1.5">
                {[{ value: 'all', label: 'Tất cả sách' }, { value: 'available', label: 'Còn sách mượn' }].map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      checked={statusFilter === opt.value}
                      onChange={() => setStatusFilter(opt.value as 'all' | 'available')}
                      className="accent-primary-600"
                    />
                    <span className="text-sm text-ink-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-500">Sắp xếp</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Danh mục */}
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-500">Danh mục</p>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary-50 font-semibold text-primary-700'
                        : 'text-ink-600 hover:bg-slate-50 hover:text-ink-900'
                    }`}
                  >
                    {selectedCategory === cat && <span className="mr-1.5"></span>}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ===== BOOK GRID ===== */}
        <div className="flex-1">
          {/* Toolbar: hiển thị bộ lọc đang áp dụng */}
          {(selectedCategory || statusFilter !== 'all') && (
            <div className="toolbar mb-4">
              {selectedCategory && (
                <span className="tag">
                  {selectedCategory}
                  <button onClick={() => handleCategoryClick(selectedCategory)} className="ml-2 opacity-60 hover:opacity-100">×</button>
                </span>
              )}
              {statusFilter === 'available' && (
                <span className="tag">
                  Còn sách mượn
                  <button onClick={() => setStatusFilter('all')} className="ml-2 opacity-60 hover:opacity-100">×</button>
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="state-card">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
              <h3 className="text-lg font-bold text-ink-900">Đang tải sách</h3>
              <p className="mt-1 text-sm text-ink-500">Đang truy vấn kho sách...</p>
            </div>
          ) : isError ? (
            <div className="state-card border-red-200 bg-red-50 text-red-700">Không thể tải danh sách sách. Vui lòng thử lại.</div>
          ) : books.length === 0 ? (
            <div className="state-card">
              <div className="state-icon text-xl"></div>
              <h3 className="text-lg font-bold text-ink-900">Không tìm thấy sách</h3>
              <p className="mt-1 text-sm text-ink-500">Thử thay đổi từ khoá hoặc danh mục tìm kiếm.</p>
              <button onClick={handleResetFilters} className="btn-secondary mt-4">Xoá bộ lọc</button>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-ink-500">Hiển thị <span className="font-semibold text-ink-800">{books.length}</span> kết quả</p>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    disabled={isMutating}
                    isReserved={reservedBookIds.has(book.id)}
                    onActionClick={handleBorrow}
                    onReserveClick={handleReserve}
                  />
                ))}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSearchPage;
