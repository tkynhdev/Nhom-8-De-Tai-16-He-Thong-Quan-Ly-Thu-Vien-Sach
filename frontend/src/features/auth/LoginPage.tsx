import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../hooks/useAuth';
import Icon from '../../components/Icon';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [memberCode, setMemberCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!memberCode.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ mã thành viên và mật khẩu.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login({ memberCode, password });
      if (user.role === 'MEMBER') navigate('/', { replace: true });
      else if (user.role === 'LIBRARIAN') navigate('/librarian/inventory', { replace: true });
      else navigate('/admin/reports', { replace: true });
    } catch {
      setError('Mã thành viên hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (type: 'member' | 'admin') => {
    setMemberCode(type);
    setPassword(type === 'member' ? 'member123' : 'admin123');
    setError('');
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-white shadow-panel lg:grid-cols-[1fr_420px]">

        {/* ===== CỘT TRÁI: Giới thiệu (học từ login.php 2-panel) ===== */}
        <section
          className="relative hidden overflow-hidden border-r border-border lg:block"
          style={{ background: '#17211f' }}
        >
          <div className="relative flex h-full flex-col justify-between p-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-sm font-semibold text-white">
                <Icon name="book" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">LibSys</h1>
                <p className="text-xs text-slate-300">Hệ thống thư viện số</p>
              </div>
            </div>

            {/* Main text */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-300">Thư viện trực tuyến</p>
              <h2 className="text-4xl font-semibold leading-tight text-white">
                Đăng nhập để tiếp tục mượn sách và theo dõi hạn trả.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Đăng nhập để mượn sách, theo dõi lịch sử và đặt chỗ ngay khi sách hết.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: 'book', label: 'Kho sách' },
                { icon: 'check', label: 'Mượn nhanh' },
                { icon: 'chart', label: 'Theo dõi' },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-white/10 bg-white/5 p-3 text-center">
                  <Icon name={item.icon as any} className="mx-auto h-5 w-5 text-slate-200" />
                  <p className="mt-1 text-xs font-semibold text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CỘT PHẢI: Form đăng nhập ===== */}
        <section className="flex flex-col justify-center p-6 sm:p-8">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-700 text-sm font-semibold text-white">
              <Icon name="book" className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-ink-900">LibSys</h1>
          </div>

          <div className="mb-8">
            <p className="section-kicker">Xin chào!</p>
            <h2 className="panel-title text-2xl">Đăng nhập tài khoản</h2>
            <p className="panel-description">Nhập mã thành viên và mật khẩu của bạn.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="memberCode">Mã thành viên</label>
              <input
                id="memberCode"
                className="input-field"
                type="text"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                placeholder="Nhập mã thành viên..."
                autoComplete="username"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="form-label mb-0" htmlFor="password">Mật khẩu</label>
              </div>
              <input
                id="password"
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <button
              className="btn-primary w-full py-3 text-base font-bold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Đang đăng nhập...
                </span>
              ) : 'Đăng nhập'}
            </button>
          </form>

          {/* Link đăng ký */}
          <p className="mt-5 text-center text-sm text-ink-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:underline">
              Đăng ký thành viên
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-6 border-t border-border pt-5">
            <p className="mb-3 text-center text-xs font-semibold text-ink-400">TÀI KHOẢN DEMO</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn-secondary text-sm"
                type="button"
                onClick={() => fillDemo('member')}
              >
                <Icon name="user" />
                Thành viên
              </button>
              <button
                className="btn-secondary text-sm"
                type="button"
                onClick={() => fillDemo('admin')}
              >
                <Icon name="settings" />
                Quản trị viên
              </button>
            </div>
          </div>

          {/* Back to home */}
          <Link to="/" className="mt-4 block text-center text-xs text-ink-400 hover:text-primary-600 transition-colors">
            ← Về trang chủ thư viện
          </Link>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
