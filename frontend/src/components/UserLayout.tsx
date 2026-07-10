import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Icon from './Icon';

const navItems = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Danh sách sách', path: '/san-pham' },
  { name: 'Giới thiệu', path: '/gioi-thieu' },
  { name: 'Liên hệ', path: '/lien-he' },
];

const isActivePath = (currentPath: string, itemPath: string) => {
  if (itemPath === '/') return currentPath === '/';
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
};

const roleLabel: Record<string, string> = {
  MEMBER: 'Thành viên',
  LIBRARIAN: 'Thủ thư',
  ADMIN: 'Quản trị viên',
};

const UserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Hiện nút back-to-top
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell flex min-h-screen flex-col">
      {/* ===== TOP BAR ===== */}
      <div className="hidden border-b border-border bg-slate-50 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs text-ink-500 sm:px-6">
          <span>Thư viện LibSys — Hỗ trợ mượn sách trực tuyến 24/7</span>
          <div className="flex items-center gap-4">
            <a href="mailto:support@libsys.local" className="hover:text-primary-600 transition-colors">
              support@libsys.local
            </a>
            <span>|</span>
            <span>1800-LIBSYS</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="sticky top-0 z-30 border-b border-border bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-700 text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                <Icon name="book" className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold leading-tight text-ink-900">LibSys</h2>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Thư viện số</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) => {
                const isActive = isActivePath(location.pathname, item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-ink-600 hover:bg-slate-50 hover:text-ink-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Nút danh sách sách nhanh */}
                  <Link
                    to="/san-pham"
                    className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-700 sm:flex"
                    title="Tìm sách"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="hidden md:inline">Tìm sách</span>
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink-800 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                        {user.memberCode.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="hidden max-w-[100px] truncate sm:block">{user.memberCode}</span>
                      <svg className={`h-4 w-4 text-ink-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                        {/* Header dropdown */}
                        <div className="border-b border-border bg-slate-50 px-4 py-3">
                          <p className="text-sm font-bold text-ink-900">{user.memberCode}</p>
                          <p className="mt-0.5 text-xs font-semibold text-primary-600">
                            {roleLabel[user.role] ?? user.role}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-slate-50"
                          >
                            <svg className="h-4 w-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Hồ sơ của tôi
                          </Link>
                          <Link
                            to="/san-pham"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-slate-50"
                          >
                            <svg className="h-4 w-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Danh sách sách
                          </Link>
                          <Link
                            to="/lich-su"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-slate-50"
                          >
                            <svg className="h-4 w-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Lịch sử mượn sách
                          </Link>

                          {(user.role === 'ADMIN' || user.role === 'LIBRARIAN') && (
                            <>
                              <div className="my-1 border-t border-border" />
                              <Link
                                to={user.role === 'ADMIN' ? '/admin' : '/librarian/inventory'}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                              >
                                <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {roleLabel[user.role]} Dashboard
                              </Link>
                            </>
                          )}

                          <div className="my-1 border-t border-border" />
                          <button
                            onClick={logout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link className="btn-secondary hidden sm:inline-flex" to="/register">
                    Đăng ký
                  </Link>
                  <Link className="btn-primary" to="/login">
                    Đăng nhập
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="ml-1 rounded-lg p-2 text-ink-600 hover:bg-slate-100 lg:hidden"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="border-t border-border pb-3 pt-2 lg:hidden">
              <div className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const isActive = isActivePath(location.pathname, item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-ink-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 bg-canvas px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border bg-ink-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Col 1: Về thư viện */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-700">
                  <Icon name="book" className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">LibSys</span>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Thư viện sách trực tuyến hiện đại, giúp thành viên mượn, đặt chỗ và theo dõi sách dễ dàng mọi lúc mọi nơi.
              </p>
              <div className="mt-4 flex gap-3">
                {/* Social icons */}
                {['M24 4.557c-.883.392-1.832.656-2.828.775...', 'M12 2.163c3.204 0...', 'M23.953 4.57a10...'].map((_, i) => (
                  <a key={i} href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors hover:bg-primary-600 hover:text-white text-xs font-bold">
                    {['FB', 'ZL', 'YT'][i]}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Danh mục sách */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">Danh mục</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                {['Khoa học — Kỹ thuật', 'Văn học — Tiểu thuyết', 'Kinh tế — Quản trị', 'Lịch sử — Xã hội', 'Thiếu nhi'].map((cat) => (
                  <li key={cat}>
                    <Link to="/san-pham" className="transition-colors hover:text-white">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Tài khoản */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">Tài khoản</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/profile" className="transition-colors hover:text-white">Hồ sơ của tôi</Link></li>
                <li><Link to="/lich-su" className="transition-colors hover:text-white">Lịch sử mượn sách</Link></li>
                <li><Link to="/san-pham" className="transition-colors hover:text-white">Tìm kiếm sách</Link></li>
                <li><Link to="/login" className="transition-colors hover:text-white">Đăng nhập</Link></li>
                <li><Link to="/register" className="transition-colors hover:text-white">Đăng ký thành viên</Link></li>
              </ul>
            </div>

            {/* Col 4: Hỗ trợ & Liên hệ */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/lien-he" className="transition-colors hover:text-white">Liên hệ thư viện</Link></li>
                <li><Link to="/gioi-thieu" className="transition-colors hover:text-white">Giới thiệu</Link></li>
                <li><a href="#" className="transition-colors hover:text-white">Quy định mượn sách</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Chính sách phí phạt</a></li>
              </ul>
              <div className="mt-5 space-y-1.5 text-sm text-slate-400">
                <p>support@libsys.local</p>
                <p>1800-LIBSYS</p>
                <p>T2–T7: 7:30 – 17:30</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-700 pt-6 text-center text-xs text-slate-500 sm:flex-row">
            <p>© 2025 LibSys — Hệ thống Quản lý Thư viện Sách</p>
            <p>Thời hạn mượn: <span className="text-slate-300">14 ngày</span> · Phí phạt: <span className="text-slate-300">1.000đ/ngày</span></p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all hover:bg-primary-700 hover:scale-110"
          title="Lên đầu trang"
        >
          <Icon name="arrowUp" className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default UserLayout;
