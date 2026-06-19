import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

const BookSearchPage = lazy(() => import('./features/books/pages/BookSearchPage'));
const MyLoansPage = lazy(() => import('./features/loans/pages/MyLoansPage'));
const InventoryPage = lazy(() => import('./features/inventory/pages/InventoryPage'));
const ProcessReturnsPage = lazy(() => import('./features/loans/pages/ProcessReturnsPage'));
const ReportsPage = lazy(() => import('./features/statistics/pages/ReportsPage'));

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
    <div className="rounded-xl bg-white px-6 py-5 shadow-lg border border-slate-200">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <span className="text-sm font-medium text-slate-700">Loading page...</span>
      </div>
    </div>
  </div>
);

// Component bảo vệ Route chưa implement
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  if (!isAuthenticated) {
    // Tạm thời redirect về login nếu chưa có token, trong thực tế sẽ có Login Page
    // return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/books" replace />} />
            <Route path="books" element={<BookSearchPage />} />
            <Route path="my-loans" element={<MyLoansPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="process-returns" element={<ProcessReturnsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
