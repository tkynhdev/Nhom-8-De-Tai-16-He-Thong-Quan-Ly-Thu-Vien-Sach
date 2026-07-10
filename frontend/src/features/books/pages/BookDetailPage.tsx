import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookCover } from '../../../components/BookCard';
import BookCard from '../../../components/BookCard';
import { useBooks } from '../api/useBooks';
import { useBorrowBook } from '../../loans/api/useBorrowBook';
import { useMyReservations, useReserveBook } from '../../loans/api/useReserveBook';

const BORROW_POLICIES = [
  { icon: '', label: 'Thời hạn mượn', value: '14 ngày' },
  { icon: '', label: 'Gia hạn tối đa', value: '2 lần' },
  { icon: '', label: 'Phí phạt trễ hạn', value: '1.000đ / ngày' },
  { icon: '', label: 'Tối đa đang mượn', value: '5 cuốn' },
];

const BookDetailPage: React.FC = () => {
  const { bookId } = useParams();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const { data, isLoading, isError } = useBooks({ page: 0, size: 200 });
  const { data: reservations = [] } = useMyReservations();
  const borrowBook = useBorrowBook();
  const reserveBook = useReserveBook();

  const book = data?.content.find((item) => item.id === Number(bookId));
  const isReserved = reservations.some((r) => r.bookId === book?.id && r.status === 'PENDING');
  const isAvailable = (book?.availableCopies ?? 0) > 0;
  const isMutating = borrowBook.isPending || reserveBook.isPending;

  // Sách cùng danh mục (loại bỏ sách hiện tại, lấy tối đa 4)
  const relatedBooks = (data?.content ?? [])
    .filter((b) => b.id !== Number(bookId) && b.category === book?.category)
    .slice(0, 4);

  const errorMessage = (error: any, fallback: string) => {
    const response = error?.response?.data;
    return response?.message || (typeof response === 'string' ? response : fallback);
  };

  const handleAction = () => {
    if (!book) return;
    if (!localStorage.getItem('accessToken')) { window.location.href = '/login'; return; }
    setMessage('');
    if (isAvailable) {
      borrowBook.mutate(
        { bookId: book.id },
        {
          onSuccess: () => { setMessageType('success'); setMessage('Mượn sách thành công! Hạn trả sau 14 ngày.'); },
          onError: (err: any) => { setMessageType('error'); setMessage(errorMessage(err, 'Chưa thể mượn sách này.')); },
        }
      );
    } else {
      reserveBook.mutate(
        { bookId: book.id },
        {
          onSuccess: () => { setMessageType('success'); setMessage('Đặt chỗ thành công! Chúng tôi sẽ thông báo khi sách có sẵn.'); },
          onError: (err: any) => { setMessageType('error'); setMessage(errorMessage(err, 'Chưa thể đặt chỗ sách này.')); },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="state-card">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <p className="text-sm text-ink-500">Đang tải thông tin sách...</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="state-card">
        <div className="state-icon text-2xl"></div>
        <h3 className="text-lg font-bold text-ink-900">Không tìm thấy sách</h3>
        <p className="mt-1 text-sm text-ink-500">Sách này không tồn tại hoặc đã bị xoá.</p>
        <Link className="btn-secondary mt-4" to="/san-pham">← Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/san-pham" className="hover:text-primary-600 transition-colors">Danh sách sách</Link>
        <span>/</span>
        <span className="font-semibold text-ink-900 line-clamp-1">{book.title}</span>
      </nav>

      {/* ===== MAIN DETAIL: 2 cột học từ product-detail.php ===== */}
      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Ảnh bìa */}
        <BookCover book={book} large />

        {/* Thông tin sách */}
        <div className="panel flex flex-col">
          <p className="section-kicker">Chi tiết sách</p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-ink-900 sm:text-3xl">{book.title}</h1>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="tag">{book.category}</span>
            <span className={`tag ${isAvailable ? 'border-accent-100 bg-accent-50 text-accent-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {isAvailable ? ` Còn ${book.availableCopies} bản` : ' Hết sách'}
            </span>
            {isReserved && <span className="tag border-gold-100 bg-gold-100 text-gold-600">Đã đặt chỗ</span>}
          </div>

          {/* Thông tin chi tiết */}
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'ISBN', value: book.isbn, mono: true },
              { label: 'Tác giả', value: book.author },
              { label: 'Danh mục', value: book.category },
              { label: 'Bản có sẵn', value: `${book.availableCopies} bản` },
            ].map(({ label, value, mono }) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4">
                <dt className="stat-label">{label}</dt>
                <dd className={`mt-1 font-semibold text-ink-900 ${mono ? 'font-mono text-sm' : ''}`}>{value}</dd>
              </div>
            ))}
          </dl>

          {/* Thông báo */}
          {message && (
            <div className={`mt-5 rounded-lg border px-4 py-3 text-sm font-semibold ${messageType === 'success' ? 'border-accent-100 bg-accent-50 text-accent-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Action button */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className={`flex-1 ${isAvailable ? 'btn-primary' : 'btn-secondary'} py-3 text-base font-bold`}
              type="button"
              disabled={isMutating || isReserved}
              onClick={handleAction}
            >
              {isMutating
                ? 'Đang xử lý...'
                : isAvailable
                ? ' Mượn sách này'
                : isReserved
                ? ' Đã đặt chỗ'
                : ' Đặt chỗ sách này'}
            </button>
            <Link to="/san-pham" className="btn-secondary py-3 text-center">
              ← Quay lại
            </Link>
          </div>

          {/* Chính sách mượn — học từ product-detail.php "thông tin thêm" */}
          <div className="mt-6 rounded-xl border border-border bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-bold text-ink-800"> Chính sách mượn sách</h3>
            <div className="grid grid-cols-2 gap-2">
              {BORROW_POLICIES.map((p) => (
                <div key={p.label} className="flex items-start gap-2">
                  <span className="text-base">{p.icon}</span>
                  <div>
                    <p className="text-xs text-ink-500">{p.label}</p>
                    <p className="text-sm font-semibold text-ink-800">{p.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SÁCH LIÊN QUAN (học từ related-products-section) ===== */}
      {relatedBooks.length > 0 && (
        <section>
          <div className="panel-header mb-5">
            <div>
              <p className="section-kicker">Cùng danh mục</p>
              <h2 className="panel-title">Sách liên quan</h2>
              <p className="panel-description">Các sách cùng danh mục "{book.category}" bạn có thể thích.</p>
            </div>
            <Link to={`/san-pham`} className="btn-secondary shrink-0">Xem thêm →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedBooks.map((rb) => (
              <BookCard key={rb.id} book={rb} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetailPage;
