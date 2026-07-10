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
  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800 to-indigo-900 shadow-inner group-hover:shadow-glow transition-all duration-300 ${large ? 'min-h-[400px]' : 'min-h-[260px]'}`}>
    {book.coverUrl ? (
      <img
        className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-90 group-hover:scale-110 transition-transform duration-700"
        src={book.coverUrl}
        alt={`Bìa sách ${book.title}`}
        loading="lazy"
      />
    ) : null}
    <div className={`absolute inset-0 ${book.coverUrl ? 'bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-transparent' : ''}`} />
    
    {/* Decorative Top Accent */}
    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-400 to-primary-400 opacity-80" />
    
    <div className={`relative flex h-full flex-col justify-between ${large ? 'p-8' : 'p-5'}`}>
      <div className="transform transition-transform duration-300 group-hover:translate-y-1">
        <span className="inline-block rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-100 backdrop-blur-md border border-white/10 mb-3">
          {book.isbn}
        </span>
        <h3 className={`${large ? 'text-4xl' : 'text-xl'} font-extrabold leading-tight text-white drop-shadow-md`}>
          {book.title}
        </h3>
      </div>
      <div className="border-t border-white/20 pt-4 mt-auto">
        <p className="text-sm font-bold text-primary-100">{book.author}</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/60">{book.category}</p>
      </div>
    </div>
  </div>
);

const BookCard: React.FC<BookCardProps> = ({ book, onActionClick, onReserveClick, disabled = false, isReserved = false }) => {
  const isAvailable = book.availableCopies > 0;
  const isDisabled = disabled || isReserved || (!isAvailable && !onReserveClick);

  return (
    <article className="glass-card flex h-full flex-col p-4 group relative overflow-hidden bg-white/80">
      
      {/* Availability Badge */}
      <div className="absolute top-6 right-6 z-10">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-sm backdrop-blur-md border ${isAvailable ? 'bg-accent-400 text-white border-accent-300' : 'bg-red-500 text-white border-red-400'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
          {isAvailable ? `Còn ${book.availableCopies}` : 'Hết sách'}
        </span>
      </div>

      <Link to={`/san-pham/${book.id}`} className="block">
        <BookCover book={book} />
      </Link>

      <div className="mt-5 flex-1 px-1">
        <Link to={`/san-pham/${book.id}`} className="block mb-4">
          <h3 className="line-clamp-2 text-lg font-extrabold text-ink-900 group-hover:text-primary-600 transition-colors" title={book.title}>
            {book.title}
          </h3>
        </Link>

        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between border-b border-ink-100/50 pb-2">
            <dt className="text-xs font-bold uppercase tracking-widest text-ink-400">Tác giả</dt>
            <dd className="font-semibold text-ink-800 text-right">{book.author}</dd>
          </div>
          <div className="flex items-center justify-between pb-2">
            <dt className="text-xs font-bold uppercase tracking-widest text-ink-400">Danh mục</dt>
            <dd className="font-semibold text-ink-800 text-right">{book.category}</dd>
          </div>
        </dl>
      </div>

      {onActionClick || onReserveClick ? (
        <div className="mt-4 grid grid-cols-2 gap-3 px-1 pb-1">
          <Link className="btn-secondary rounded-xl py-2.5 text-xs font-black shadow-sm" to={`/san-pham/${book.id}`}>
            Xem sách
          </Link>
          <button
            className={`rounded-xl py-2.5 text-xs font-black shadow-sm transition-all duration-300 ${isAvailable ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:shadow-glow hover:scale-[1.02]' : isReserved ? 'bg-slate-200 text-slate-500' : 'bg-white border border-ink-200 text-ink-700 hover:border-primary-300 hover:text-primary-600'}`}
            type="button"
            onClick={() => (isAvailable ? onActionClick?.(book.id) : onReserveClick?.(book.id))}
            disabled={isDisabled}
          >
            {isAvailable ? 'Mượn ngay' : isReserved ? 'Đã đặt chỗ' : 'Đặt chỗ'}
          </button>
        </div>
      ) : null}
    </article>
  );
};

export default BookCard;
