import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../books/api/useBooks';
import BookCard from '../../../components/BookCard';
import { BookSearchResponse } from '../../../types/api';
import Icon, { IconName } from '../../../components/Icon';

const HIGHLIGHTS = [
  { icon: 'book', title: 'Kho sách khổng lồ', desc: 'Khám phá hàng nghìn tựa sách kỹ thuật số và bản in phong phú.' },
  { icon: 'check', title: 'Mượn sách 1 chạm', desc: 'Trải nghiệm mượn sách siêu tốc, không cần chờ đợi.' },
  { icon: 'calendar', title: 'Đặt chỗ tự động', desc: 'Hệ thống thông minh thông báo ngay khi sách có sẵn.' },
  { icon: 'chart', title: 'Kiểm soát dễ dàng', desc: 'Quản lý lịch sử mượn trả trực quan trên mọi thiết bị.' },
];

const HomePage: React.FC = () => {
  const { data: booksData, isLoading } = useBooks({ page: 0, size: 8 });
  const books = booksData?.content ?? [];

  return (
    <div className="page-stack max-w-7xl mx-auto w-full">

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-900 via-ink-900 to-accent-900 p-8 sm:p-12 lg:p-16 shadow-premium">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none mix-blend-screen" />
        
        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
              </span>
              Phiên bản 2.0 đã ra mắt
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl tracking-tight mb-6">
              Mở khóa tri thức với <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-primary-300">Thư viện số</span> tương lai.
            </h1>
            <p className="text-lg leading-relaxed text-white/80 font-medium mb-8">
              Trải nghiệm hệ thống mượn sách trực tuyến đỉnh cao. Dễ dàng tra cứu, mượn nhanh chóng và quản lý sách ngay trong tầm tay.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/san-pham" className="btn-primary px-8 py-4 text-base rounded-2xl">
                <Icon name="search" className="h-5 w-5" />
                Khám phá ngay
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 shadow-glow">
                Đăng ký miễn phí
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <Icon name="check" className="h-5 w-5 text-accent-400" />
                <span className="text-sm font-bold text-white/90">Hơn 1M+ cuốn sách</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" className="h-5 w-5 text-accent-400" />
                <span className="text-sm font-bold text-white/90">Mượn trực tuyến 24/7</span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 to-accent-500/30 blur-3xl rounded-full" />
            <img 
              src="/hero.png" 
              alt="Digital Library 3D Illustration" 
              className="relative z-10 w-full max-w-[600px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 mx-auto"
            />
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 px-2 -mt-4 relative z-20">
        {[
          { value: booksData?.totalElements ?? '...', label: 'Đầu sách đa dạng' },
          { value: '14 Ngày', label: 'Thời hạn mượn' },
          { value: '1K VNĐ', label: 'Phí phạt cực thấp' },
          { value: '99.9%', label: 'Hệ thống online' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card bg-white/80 p-6 text-center shadow-lg border border-white">
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 mb-1">{stat.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ===== FEATURES ===== */}
      <section className="mt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-kicker justify-center flex items-center gap-2">
            <span className="w-8 h-[2px] bg-primary-600 rounded-full" />
            Trải nghiệm khác biệt
            <span className="w-8 h-[2px] bg-primary-600 rounded-full" />
          </span>
          <h2 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">Tại sao chọn LibSys?</h2>
          <p className="mt-4 text-base text-ink-500 font-medium">Hệ thống thư viện thông minh được thiết kế để mang lại sự tiện lợi tối đa cho người dùng.</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, idx) => (
            <div key={item.title} className="glass-card bg-white/60 p-8 group" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-50 text-primary-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Icon name={item.icon as IconName} className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-2">{item.title}</h3>
              <p className="text-sm font-medium text-ink-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SÁCH NỔI BẬT ===== */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="section-kicker">Nổi bật nhất tuần</span>
            <h2 className="text-3xl font-extrabold text-ink-900">Sách được yêu thích</h2>
          </div>
          <Link to="/san-pham" className="group flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-primary-800">
            Khám phá tất cả 
            <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="glass-panel p-20 flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mb-4" />
            <p className="font-bold text-ink-500 animate-pulse">Đang tải kệ sách...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book: BookSearchResponse) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA ĐĂNG KÝ ===== */}
      <section className="mt-16 rounded-[2rem] bg-[url('/hero.png')] bg-cover bg-center bg-no-repeat relative overflow-hidden shadow-premium before:absolute before:inset-0 before:bg-ink-900/80 before:backdrop-blur-sm">
        <div className="relative z-10 px-6 py-16 sm:py-24 text-center max-w-3xl mx-auto">
          <Icon name="book" className="h-12 w-12 text-white/50 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Bắt đầu hành trình tri thức</h2>
          <p className="text-lg text-white/80 font-medium mb-10 max-w-xl mx-auto">
            Gia nhập cộng đồng hơn 10.000+ thành viên đang sử dụng hệ thống thư viện thông minh mỗi ngày. Đăng ký hoàn toàn miễn phí.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-4 text-base rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]">
              Đăng ký thành viên ngay
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
