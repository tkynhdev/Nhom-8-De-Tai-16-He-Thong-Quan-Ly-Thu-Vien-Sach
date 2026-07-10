import React from 'react';
import { Link } from 'react-router-dom';
import { BookSearchResponse } from '../types/api';

interface BookCardProps {
  book: BookSearchResponse;
  onActionClick?: (bookId: number) => void;
  onReserveClick?: (bookId: number) => void;
  disabled?: boolean;
  isReserved?: boolean;
}

export const BookCover = ({ book, large = false }: { book: BookSearchResponse; large?: boolean }) => (
  <div className={`relative overflow-hidden rounded-lg border border-primary-100 bg-primary-700 ${large ? 'min-h-96' : 'min-h-56'}`}>
    {book.coverUrl ? (
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={book.coverUrl}
        alt={`Bìa sách ${book.title}`}
        loading="lazy"
      />
    ) : null}
    <div className={`absolute inset-0 ${book.coverUrl ? 'bg-gradient-to-t from-black/70 via-black/10 to-transparent' : ''}`} />
    <div className="absolute inset-x-0 top-0 h-2 bg-accent-600" />
    <div className={`relative flex flex-col justify-between ${large ? 'min-h-96 p-8' : 'min-h-56 p-5'}`}>
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary-100">{book.isbn}</p>
        <h3 className={`${large ? 'mt-8 text-4xl' : 'mt-6 text-2xl'} font-bold leading-tight text-white`}>
          {book.title}
        </h3>
      </div>
      <div className="mt-8 border-t border-white/20 pt-4">
        <p className="text-sm font-semibold text-primary-100">{book.author}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-white/70">{book.category}</p>
      </div>
    </div>
  </div>
);

const BookCard: React.FC<BookCardProps> = ({ book, onActionClick, onReserveClick, disabled = false, isReserved = false }) => {
  const isAvailable = book.availableCopies > 0;
  const isDisabled = disabled || isReserved || (!isAvailable && !onReserveClick);

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-white p-4 shadow-panel">
      <BookCover book={book} />

      <div className="mb-4 mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-500">{book.isbn}</p>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-ink-900" title={book.title}>
            {book.title}
          </h3>
        </div>
        <span className={isAvailable ? 'tag border-accent-100 bg-accent-50 text-accent-700' : 'tag border-red-200 bg-red-50 text-red-700'}>
          {isAvailable ? `Còn ${book.availableCopies} cuốn` : 'Hết sách'}
        </span>
      </div>

      <dl className="mb-5 space-y-2 text-sm">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">Tác giả</dt>
          <dd className="text-ink-800">{book.author}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">Danh mục</dt>
          <dd className="text-ink-800">{book.category}</dd>
        </div>
      </dl>

      {onActionClick || onReserveClick ? (
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link className="btn-secondary" to={`/san-pham/${book.id}`}>
            Chi tiết
          </Link>
          <button
            className={isAvailable ? 'btn-primary' : 'btn-secondary'}
            type="button"
            onClick={() => (isAvailable ? onActionClick?.(book.id) : onReserveClick?.(book.id))}
            disabled={isDisabled}
          >
            {isAvailable ? 'Mượn' : isReserved ? 'Đã đặt' : 'Đặt chỗ'}
          </button>
        </div>
      ) : null}
    </article>
  );
};

export default BookCard;
