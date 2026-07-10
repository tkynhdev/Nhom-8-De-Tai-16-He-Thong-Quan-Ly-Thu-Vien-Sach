import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Icon, { IconName } from './Icon';

const pageTitles: Record<string, { title: string; subtitle: string; icon: IconName }> = {
  '/admin/inventory': { icon: 'archive', title: 'Kho sách', subtitle: 'Theo dõi bản sao, vị trí kệ và trạng thái lưu thông.' },
  '/admin/books': { icon: 'book', title: 'Danh mục sách', subtitle: 'Tạo và quản lý thông tin đầu sách.' },
  '/admin/process-returns': { icon: 'refresh', title: 'Mượn trả sách', subtitle: 'Mượn, trả, in biên nhận và xử lý sách quá hạn.' },
  '/admin/reports': { icon: 'chart', title: 'Báo cáo', subtitle: 'Thống kê mượn trả, quá hạn, tiền phạt và nhu cầu sách.' },
  '/admin/members': { icon: 'users', title: 'Thành viên', subtitle: 'Quản lý tài khoản, vai trò và hạn thẻ thư viện.' },
  '/admin/settings': { icon: 'settings', title: 'Cài đặt', subtitle: 'Cấu hình quy tắc mượn và mức phí phạt.' },
  '/librarian/inventory': { icon: 'archive', title: 'Kho sách', subtitle: 'Theo dõi bản sao, vị trí kệ và trạng thái lưu thông.' },
  '/librarian/books': { icon: 'book', title: 'Danh mục sách', subtitle: 'Tạo và quản lý thông tin đầu sách.' },
  '/librarian/process-returns': { icon: 'refresh', title: 'Mượn trả sách', subtitle: 'Mượn, trả, in biên nhận và xử lý sách quá hạn.' },
  '/librarian/reports': { icon: 'chart', title: 'Báo cáo', subtitle: 'Thống kê mượn trả, quá hạn, tiền phạt và nhu cầu sách.' },
};

const navItems = [
  { name: 'Danh mục sách', icon: 'book', path: 'books', roles: ['LIBRARIAN', 'ADMIN'] },
  { name: 'Kho sách', icon: 'archive', path: 'inventory', roles: ['LIBRARIAN', 'ADMIN'] },
  { name: 'Mượn trả', icon: 'refresh', path: 'process-returns', roles: ['LIBRARIAN', 'ADMIN'] },
  { name: 'Báo cáo', icon: 'chart', path: 'reports', roles: ['LIBRARIAN', 'ADMIN'] },
  { name: 'Thành viên', icon: 'users', path: 'members', roles: ['ADMIN'] },
  { name: 'Cài đặt', icon: 'settings', path: 'settings', roles: ['ADMIN'] },
];

const roleLabel: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'Quản trị viên', color: 'bg-red-50 text-red-700 border-red-200' },
  LIBRARIAN: { label: 'Thủ thư', color: 'bg-primary-50 text-primary-700 border-primary-200' },
  MEMBER: { label: 'Thành viên', color: 'bg-accent-50 text-accent-700 border-accent-100' },
};

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const basePath = user?.role === 'LIBRARIAN' ? '/librarian' : '/admin';
  const pageMeta = pageTitles[location.pathname] ?? { icon: 'book' as IconName, title: 'LibSys', subtitle: 'Không gian làm việc thư viện.' };
  const filteredNavItems = user ? navItems.filter((item) => item.roles.includes(user.role)) : navItems;
  const roleInfo = roleLabel[user?.role ?? ''] ?? { label: user?.role ?? 'Staff', color: 'bg-slate-100 text-slate-600 border-slate-200' };

  return (
    <div className="app-shell flex">
      {/* ===== SIDEBAR ===== */}
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 shrink-0 flex-col border-r border-border bg-white transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-700 shadow-sm">
              <Icon name="book" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900">LibSys</h2>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Quản lý thư viện</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-ink-400">Nghiệp vụ</p>
          {filteredNavItems.map((item) => {
            const itemPath = `${basePath}/${item.path}`;
            const isActive = location.pathname === itemPath;
            return (
              <Link
                key={item.path}
                to={itemPath}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-ink-600 hover:bg-slate-50 hover:text-ink-900'
                }`}
              >
                <Icon name={item.icon as IconName} className="h-4 w-4" />
                {item.name}
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-600" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              {(user?.memberCode ?? 'U').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">{user?.memberCode ?? 'Người dùng'}</p>
              <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/" className="btn-secondary w-full justify-center text-xs py-2">
              <Icon name="home" />
              Về trang chủ
            </Link>
            <button className="btn-danger w-full justify-center text-xs py-2" type="button" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="border-b border-border bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile hamburger */}
            <button
              className="flex items-center gap-2 rounded-lg p-2 text-ink-600 hover:bg-slate-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                  <Icon name={pageMeta.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-xl font-black text-ink-900">{pageMeta.title}</h1>
                  <p className="text-xs text-ink-500">{pageMeta.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`hidden rounded-full border px-3 py-1 text-xs font-bold sm:inline-flex ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
              <button
                className="btn-secondary text-xs py-1.5 px-3"
                type="button"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Mobile nav tabs */}
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 md:hidden">
            {filteredNavItems.map((item) => {
              const itemPath = `${basePath}/${item.path}`;
              const isActive = location.pathname === itemPath;
              return (
                <Link
                  key={item.path}
                  to={itemPath}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon name={item.icon as IconName} className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-canvas p-4 sm:p-6">
          <div className="mx-auto max-w-7xl pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
