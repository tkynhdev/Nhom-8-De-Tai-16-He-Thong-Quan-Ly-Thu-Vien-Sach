import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import UserLayout from './components/UserLayout';
import useAuth, { AuthRole } from './hooks/useAuth';

// ── Auth & Member ──────────────────────────────────────────────
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));

// ── User / Public pages ────────────────────────────────────────
const HomePage = lazy(() => import('./features/member/pages/HomePage'));
const BookSearchPage = lazy(() => import('./features/books/pages/BookSearchPage'));
const BookDetailPage = lazy(() => import('./features/books/pages/BookDetailPage'));
const MyLoansPage = lazy(() => import('./features/loans/pages/MyLoansPage'));
const LoanDetailPage = lazy(() => import('./features/loans/pages/LoanDetailPage'));
const ProfilePage = lazy(() => import('./features/member/pages/ProfilePage'));

// ── Marketing pages ────────────────────────────────────────────
const MarketingPage = lazy(() => import('./features/marketing/MarketingPages'));
const AboutPage = lazy(() => import('./features/marketing/MarketingPages').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./features/marketing/MarketingPages').then(m => ({ default: m.ContactPage })));

// ── Librarian / Admin pages ────────────────────────────────────
const BooksManagementPage = lazy(() => import('./features/books/pages/BooksManagementPage'));
const InventoryPage = lazy(() => import('./features/inventory/pages/InventoryPage'));
const ProcessReturnsPage = lazy(() => import('./features/loans/pages/ProcessReturnsPage'));
const ReportsPage = lazy(() => import('./features/statistics/pages/ReportsPage'));
const MembersPage = lazy(() => import('./features/admin/pages/MembersPage'));
const SettingsPage = lazy(() => import('./features/admin/pages/SettingsPage'));

// ── Loading Fallback ───────────────────────────────────────────
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-canvas">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
      <p className="text-sm font-semibold text-ink-500">Đang tải trang...</p>
    </div>
  </div>
);

// ── Route Helpers ──────────────────────────────────────────────
const defaultPathForRole = (role?: AuthRole) => {
  if (role === 'MEMBER') return '/';
  if (role === 'LIBRARIAN') return '/librarian/inventory';
  return '/admin/reports';
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isReady } = useAuth();
  if (!isReady) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RoleRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: AuthRole[];
  children: React.ReactNode;
}) => {
  const { user, isReady } = useAuth();
  if (!isReady) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={defaultPathForRole(user.role)} replace />;
  }
  return <>{children}</>;
};

const HomeRedirect = () => {
  const { user, isReady } = useAuth();
  if (!isReady) return <LoadingFallback />;
  return <Navigate to={user ? defaultPathForRole(user.role) : '/login'} replace />;
};

// ── App ────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ── PUBLIC / USER routes (dùng UserLayout với Header+Footer đẹp) ── */}
          <Route path="/" element={<UserLayout />}>
            {/* Trang chủ */}
            <Route index element={<HomePage />} />

            {/* Danh sách sách & chi tiết */}
            <Route path="san-pham" element={<BookSearchPage />} />
            <Route path="san-pham/:bookId" element={<BookDetailPage />} />
            
            {/* Giới thiệu & Liên hệ */}
            <Route path="gioi-thieu" element={<AboutPage />} />
            <Route path="lien-he" element={<ContactPage />} />

            {/* Lịch sử mượn (yêu cầu đăng nhập + role MEMBER) */}
            <Route
              path="lich-su"
              element={
                <RoleRoute allowedRoles={['MEMBER']}>
                  <MyLoansPage />
                </RoleRoute>
              }
            />
            {/* Chi tiết phiếu mượn */}
            <Route
              path="lich-su/:loanId"
              element={
                <RoleRoute allowedRoles={['MEMBER']}>
                  <LoanDetailPage />
                </RoleRoute>
              }
            />

            {/* Hồ sơ thành viên */}
            <Route
              path="profile"
              element={
                <RoleRoute allowedRoles={['MEMBER']}>
                  <ProfilePage />
                </RoleRoute>
              }
            />
          </Route>

          {/* ── Marketing pages ── */}
          <Route path="/phan-mem" element={<MarketingPage kind="product" />} />
          <Route path="/tinh-nang" element={<MarketingPage kind="features" />} />
          <Route path="/quan-ly" element={<MarketingPage kind="management" />} />
          <Route path="/bang-gia" element={<MarketingPage kind="pricing" />} />
          <Route path="/blog" element={<MarketingPage kind="blog" />} />

          {/* ── Auth ── */}
          <Route path="/app" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Legacy member redirects ── */}
          <Route path="/member" element={<AuthRoute><UserLayout /></AuthRoute>}>
            <Route index element={<Navigate to="/" replace />} />
            <Route path="books" element={<Navigate to="/san-pham" replace />} />
            <Route path="books/:bookId" element={<Navigate to="/san-pham" replace />} />
            <Route path="my-loans" element={<Navigate to="/lich-su" replace />} />
          </Route>

          {/* ── Librarian routes ── */}
          <Route path="/librarian" element={<AuthRoute><Layout /></AuthRoute>}>
            <Route index element={<Navigate to="/librarian/inventory" replace />} />
            <Route path="books" element={<RoleRoute allowedRoles={['LIBRARIAN']}><BooksManagementPage /></RoleRoute>} />
            <Route path="inventory" element={<RoleRoute allowedRoles={['LIBRARIAN']}><InventoryPage /></RoleRoute>} />
            <Route path="process-returns" element={<RoleRoute allowedRoles={['LIBRARIAN']}><ProcessReturnsPage /></RoleRoute>} />
            <Route path="reports" element={<RoleRoute allowedRoles={['LIBRARIAN']}><ReportsPage /></RoleRoute>} />
          </Route>

          {/* ── Admin routes ── */}
          <Route path="/admin" element={<AuthRoute><Layout /></AuthRoute>}>
            <Route index element={<Navigate to="/admin/reports" replace />} />
            <Route path="books" element={<RoleRoute allowedRoles={['ADMIN']}><BooksManagementPage /></RoleRoute>} />
            <Route path="inventory" element={<RoleRoute allowedRoles={['ADMIN']}><InventoryPage /></RoleRoute>} />
            <Route path="process-returns" element={<RoleRoute allowedRoles={['ADMIN']}><ProcessReturnsPage /></RoleRoute>} />
            <Route path="reports" element={<RoleRoute allowedRoles={['ADMIN']}><ReportsPage /></RoleRoute>} />
            <Route path="members" element={<RoleRoute allowedRoles={['ADMIN']}><MembersPage /></RoleRoute>} />
            <Route path="settings" element={<RoleRoute allowedRoles={['ADMIN']}><SettingsPage /></RoleRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="/user/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
