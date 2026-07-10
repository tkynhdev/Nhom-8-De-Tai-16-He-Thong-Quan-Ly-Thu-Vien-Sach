import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../books/api/useBooks';
import BookCard from '../../../components/BookCard';
import { BookSearchResponse } from '../../../types/api';
import Icon, { IconName } from '../../../components/Icon';

const HIGHLIGHTS = [
  { icon: 'book', title: 'Kho sách phong phú', desc: 'Hàng nghìn đầu sách thuộc nhiều thể loại' },
  { icon: 'check', title: 'Mượn nhanh', desc: 'Xác nhận mượn sách chỉ trong vài giây' },
  { icon: 'calendar', title: 'Đặt chỗ rõ ràng', desc: 'Đặt chỗ khi sách đang được mượn' },
  { icon: 'chart', title: 'Theo dõi dễ dàng', desc: 'Xem lịch sử, hạn trả và trạng thái mọi lúc' },
];

const HomePage: React.FC = () => {
  // Lấy 8 sách đầu để hiển thị ở trang chủ
  const { data: booksData, isLoading } = useBooks({ page: 0, size: 8 });
  const books = booksData?.content ?? [];

  return (
    <div className="page-stack">

      {/* ===== HERO SECTION ===== */}
      <section className="grid gap-6 rounded-md border border-border bg-white p-6 shadow-panel lg:grid-cols-[1fr_320px] lg:p-8">
        <div className="max-w-2xl">
          <p className="section-kicker">Hệ thống thư viện số</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
            Tìm sách, mượn sách và theo dõi hạn trả trong một nơi.
          </h1>
          <p className="mt-4 text-base leading-7 text-ink-600">
            LibSys giúp thành viên tra cứu kho sách, mượn trực tuyến và đặt chỗ khi sách đang được mượn.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/san-pham" className="btn-primary px-5 py-3">
              <Icon name="search" />
              Tìm kiếm sách
            </Link>
            <Link to="/register" className="btn-secondary px-5 py-3">
              Đăng ký thành viên
            </Link>
          </div>
        </div>
        <div className="rounded-md border border-border bg-slate-50 p-5">
          <p className="text-sm font-semibold text-ink-900">Quy định mượn</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Thời hạn</dt>
              <dd className="font-semibold text-ink-900">14 ngày</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Phí quá hạn</dt>
              <dd className="font-semibold text-ink-900">1.000đ/ngày</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Tra cứu</dt>
              <dd className="font-semibold text-ink-900">24/7</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { value: booksData?.totalElements ?? '...', label: 'Đầu sách' },
          { value: '14 ngày', label: 'Thời hạn mượn' },
          { value: '1.000đ', label: 'Phí phạt/ngày' },
          { value: '24/7', label: 'Tra cứu trực tuyến' },
        ].map((stat) => (
          <div key={stat.label} className="panel flex flex-col items-center py-4 text-center">
            <p className="text-2xl font-semibold text-primary-700">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ===== FEATURES ===== */}
      <section className="panel">
        <div className="panel-header mb-5">
          <div>
            <p className="section-kicker">Tại sao chọn LibSys?</p>
            <h2 className="panel-title">Dịch vụ thư viện hiện đại</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="rounded-md border border-border bg-slate-50 p-5 transition-all hover:border-primary-200 hover:bg-primary-50">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white text-primary-700">
                <Icon name={item.icon as IconName} className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-ink-900">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SÁCH NỔI BẬT ===== */}
      <section>
        <div className="panel-header mb-5">
          <div>
            <p className="section-kicker">Nổi bật</p>
            <h2 className="panel-title">Sách được mượn nhiều</h2>
            <p className="panel-description">Những đầu sách được thành viên yêu thích nhất trong thư viện.</p>
          </div>
          <Link to="/san-pham" className="btn-secondary shrink-0">
            Xem tất cả →
          </Link>
        </div>

        {isLoading ? (
          <div className="state-card">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
            <p className="text-sm text-ink-500">Đang tải sách...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book: BookSearchResponse) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA ĐĂNG KÝ ===== */}
      <section className="rounded-md border border-primary-100 bg-primary-50 p-8 text-center">
        <p className="section-kicker">Bắt đầu ngay hôm nay</p>
        <h2 className="mt-2 text-2xl font-black text-ink-900">Chưa có tài khoản?</h2>
        <p className="mt-2 text-sm text-ink-500">
          Đăng ký miễn phí để mượn sách, đặt chỗ và theo dõi lịch sử mượn trả.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Đăng ký thành viên miễn phí
          </Link>
          <Link to="/san-pham" className="btn-secondary px-6 py-3 text-base">
            Xem sách trước
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
