import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import Icon, { IconName } from '../../components/Icon';

interface RegisterForm {
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    memberCode: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.memberCode.trim()) return 'Vui lòng nhập mã thành viên.';
    if (!form.name.trim()) return 'Vui lòng nhập họ và tên.';
    if (!form.email.trim() || !form.email.includes('@')) return 'Email không hợp lệ.';
    if (!form.password || form.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (form.password !== form.confirmPassword) return 'Mật khẩu xác nhận không khớp.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsSubmitting(true);
    setError('');
    try {
      await apiClient.post('/auth/register', {
        memberCode: form.memberCode,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'MEMBER',
        cardType: 'STANDARD',
        cardExpiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      });
      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data;
      setError(typeof msg === 'string' ? msg : 'Đăng ký thất bại. Mã thành viên hoặc email có thể đã được sử dụng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: 'memberCode', label: 'Mã thành viên', type: 'text', placeholder: 'Ví dụ: MV001', icon: 'id' },
    { name: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nhập họ và tên đầy đủ', icon: 'user' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'example@email.com', icon: 'mail' },
    { name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '09xx xxx xxx (tuỳ chọn)', icon: 'phone' },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Tối thiểu 6 ký tự', icon: 'shield' },
    { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu', icon: 'check' },
  ] as const;

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-white shadow-panel lg:grid-cols-[1fr_480px]">

        {/* ===== CỘT TRÁI: Giới thiệu ===== */}
        <section
          className="relative hidden overflow-hidden border-r border-border lg:block"
          style={{ background: '#17211f' }}
        >
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white">
                <Icon name="book" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">LibSys</h1>
                <p className="text-xs text-slate-300">Hệ thống thư viện số</p>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-300">Đăng ký miễn phí</p>
              <h2 className="text-4xl font-semibold leading-tight text-white">
                Tạo tài khoản để mượn sách trực tuyến.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Đăng ký tài khoản để truy cập toàn bộ kho sách và mượn trực tuyến.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Truy cập hàng nghìn đầu sách',
                'Mượn sách trực tuyến 24/7',
                'Theo dõi lịch sử và hạn trả',
                'Đặt chỗ sách khi hết bản',
              ].map((item) => (
                <p key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Icon name="check" className="h-4 w-4" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CỘT PHẢI: Form đăng ký ===== */}
        <section className="flex flex-col justify-center p-6 sm:p-8">
          <div className="mb-6">
            <p className="section-kicker" style={{ color: '#059669' }}>Tạo tài khoản</p>
            <h2 className="panel-title text-2xl">Đăng ký thành viên</h2>
            <p className="panel-description">Điền thông tin bên dưới để tạo tài khoản thư viện.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map(({ name, label, type, placeholder, icon }) => (
              <div key={name}>
                <label className="form-label" htmlFor={name}>
                  <span className="inline-flex items-center gap-2">
                    <Icon name={icon as IconName} className="h-4 w-4 text-ink-500" />
                    {label}
                  </span>
                  {name === 'phone' && <span className="ml-1 text-ink-400 font-normal">(tuỳ chọn)</span>}
                </label>
                <input
                  id={name}
                  name={name}
                  className="input-field"
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                />
              </div>
            ))}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 rounded-lg border border-accent-100 bg-accent-50 px-3 py-2.5 text-sm font-semibold text-accent-700">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" /> {success}
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
                  Đang tạo tài khoản...
                </span>
              ) : 'Đăng ký ngay'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">
              Đăng nhập tại đây
            </Link>
          </p>

          <Link to="/" className="mt-4 block text-center text-xs text-ink-400 hover:text-primary-600 transition-colors">
            ← Về trang chủ thư viện
          </Link>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
