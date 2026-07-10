import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Icon from './Icon';

const navItems = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Khám phá sách', path: '/san-pham' },
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
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Scroll handler cho Back to top và Navbar shadow
  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 300);
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell flex min-h-screen flex-col font-body bg-canvas overflow-hidden">
      {/* ===== TOP BAR ===== */}
      <div className="hidden bg-gradient-to-r from-primary-900 to-indigo-900 text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-medium sm:px-6">
          <span className="flex items-center gap-2 text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Hệ thống thư viện đang hoạt động ổn định
          </span>
          <div className="flex items-center gap-4">
            <a href="mailto:support@libsys.local" className="hover:text-primary-300 transition-colors text-white/80">
              support@libsys.local
            </a>
            <span className="text-white/40">|</span>
            <span className="text-white/80 font-bold tracking-wider">1800-LIBSYS</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-border/50 py-2' : 'bg-transparent py-4'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-glow transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Icon name="book" className="h-6 w-6 text-white drop-shadow-md" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-xl font-extrabold tracking-tight text-ink-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-accent-600 transition-all">LibSys</h2>
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400">Thư viện số</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-border/50 shadow-sm">
              {navItems.map((item) => {
                const isActive = isActivePath(location.pathname, item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-ink-600 hover:bg-white hover:text-ink-900 hover:shadow-sm'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/san-pham"
                    className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-bold text-ink-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 shadow-sm sm:flex"
                  >
                    <Icon name="search" className="h-4 w-4" />
                    <span>Tìm sách</span>
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white/80 backdrop-blur-sm p-1.5 pr-3 text-sm font-bold text-ink-800 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50 hover:shadow-md"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 text-sm font-black text-white shadow-inner">
                        {user.memberCode.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="hidden max-w-[100px] truncate sm:block">{user.memberCode}</span>
                      <svg className={`h-4 w-4 text-ink-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`absolute right-0 top-full mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl shadow-premium transition-all duration-200 ${dropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                      <div className="border-b border-border/50 bg-slate-50/50 px-5 py-4">
                        <p className="text-base font-extrabold text-ink-900">{user.memberCode}</p>
                        <p className="mt-1 inline-block rounded-md bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700">
                          {roleLabel[user.role] ?? user.role}
                        </p>
                      </div>

                      <div className="py-2 px-2">
                        <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-700">
                          <Icon name="user" className="h-4 w-4" />
                          Hồ sơ của tôi
                        </Link>
                        <Link to="/lich-su" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-700">
                          <Icon name="history" className="h-4 w-4" />
                          Lịch sử mượn
                        </Link>

                        {(user.role === 'ADMIN' || user.role === 'LIBRARIAN') && (
                          <>
                            <div className="my-1 border-t border-border/50 mx-2" />
                            <Link to={user.role === 'ADMIN' ? '/admin' : '/librarian/inventory'} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100">
                              <Icon name="chart" className="h-4 w-4" />
                              Vào trang Quản trị
                            </Link>
                          </>
                        )}

                        <div className="my-1 border-t border-border/50 mx-2" />
                        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link className="btn-secondary hidden sm:inline-flex" to="/register">Đăng ký</Link>
                  <Link className="btn-primary" to="/login">Đăng nhập</Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="ml-1 rounded-xl bg-white/80 backdrop-blur-sm p-2.5 text-ink-700 shadow-sm border border-ink-200 hover:bg-primary-50 hover:text-primary-700 lg:hidden"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                <Icon name={mobileMenuOpen ? 'x' : 'menu'} className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="mt-4 border-t border-border/50 pt-4 pb-2 lg:hidden animate-fade-in-up">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = isActivePath(location.pathname, item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`rounded-xl px-4 py-3 text-base font-bold transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-ink-700 hover:bg-primary-50 bg-white/50 border border-transparent hover:border-primary-100'
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
      <main className="flex-1 w-full bg-canvas relative pb-20">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary-50/80 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 relative z-10">
          <Outlet />
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-800 bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-ink-900 to-ink-900 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 relative z-10">
          <div className="grid gap-12 md:grid-cols-4 lg:gap-8">
            {/* Col 1 */}
            <div className="md:col-span-1">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
                  <Icon name="book" className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight">LibSys</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 font-medium">
                Thư viện số hiện đại, mang tri thức đến mọi nơi. Nền tảng quản lý mạnh mẽ, tự động hóa quy trình mượn trả.
              </p>
              <div className="mt-6 flex gap-3">
                {['M24 4.557...', 'M12 2.163...', 'M23.953 4.57...'].map((_, i) => (
                  <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:scale-110 hover:shadow-glow text-xs font-bold">
                    {['FB', 'ZL', 'YT'][i]}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Khám phá</h3>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                {['Khoa học — Kỹ thuật', 'Văn học — Tiểu thuyết', 'Kinh tế — Quản trị', 'Lịch sử — Xã hội', 'Tâm lý — Kỹ năng'].map((cat) => (
                  <li key={cat}>
                    <Link to="/san-pham" className="transition-colors hover:text-primary-400 flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Liên kết nhanh</h3>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><Link to="/profile" className="transition-colors hover:text-primary-400">Hồ sơ cá nhân</Link></li>
                <li><Link to="/lich-su" className="transition-colors hover:text-primary-400">Lịch sử mượn sách</Link></li>
                <li><Link to="/register" className="transition-colors hover:text-primary-400">Đăng ký thành viên</Link></li>
                <li><a href="#" className="transition-colors hover:text-primary-400">Quy định thư viện</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Hỗ trợ 24/7</h3>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5"><Icon name="mail" className="h-4 w-4 text-primary-400" /></div>
                  support@libsys.local
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5"><Icon name="phone" className="h-4 w-4 text-primary-400" /></div>
                  1800-LIBSYS
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5"><Icon name="clock" className="h-4 w-4 text-primary-400" /></div>
                  T2 – T7: 7:30 – 17:30
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm font-medium text-slate-500 md:flex-row">
            <p>© {new Date().getFullYear()} LibSys. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${showBackTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 to-accent-600 text-white shadow-glow transition-transform hover:scale-110"
          title="Lên đầu trang"
        >
          <Icon name="arrowUp" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default UserLayout;
