import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', roles: ['MEMBER', 'LIBRARIAN', 'ADMIN'] },
    { name: 'Search Books', path: '/books', roles: ['MEMBER', 'LIBRARIAN', 'ADMIN'] },
    { name: 'My Loans', path: '/my-loans', roles: ['MEMBER'] },
    { name: 'Inventory Management', path: '/inventory', roles: ['LIBRARIAN', 'ADMIN'] },
    { name: 'Returns & Fines', path: '/process-returns', roles: ['LIBRARIAN', 'ADMIN'] },
    { name: 'Reports', path: '/reports', roles: ['LIBRARIAN', 'ADMIN'] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <svg
            className="w-8 h-8 text-blue-500 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-xl font-bold tracking-wider">LibSys</span>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white uppercase">
              {user?.memberCode?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.memberCode || 'Guest'}</p>
              <p className="text-xs text-slate-400">{user?.role || 'Unauthenticated'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {location.pathname === '/'
              ? 'Dashboard'
              : location.pathname.replace('/', '').replace('-', ' ')}
          </h1>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
