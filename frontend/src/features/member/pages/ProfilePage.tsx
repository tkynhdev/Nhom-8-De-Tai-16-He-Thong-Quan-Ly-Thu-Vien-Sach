import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { useMyLoans } from '../../loans/api/useMyLoans';
import { useMyReservations } from '../../loans/api/useReserveBook';
import { useUpdateProfile } from '../api/useUpdateProfile';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: loans = [] } = useMyLoans();
  const { data: reservations = [] } = useMyReservations();
  const updateProfileMutation = useUpdateProfile();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        alert('Cập nhật hồ sơ thành công!');
        setIsEditing(false);
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || 'Không thể cập nhật hồ sơ lúc này.');
      }
    });
  };

  const activeLoans = loans.filter((l) => l.status === 'ACTIVE');
  const overdueLoans = loans.filter((l) => {
    return l.status !== 'RETURNED' && new Date(l.dueDate) < new Date();
  });
  const pendingReservations = reservations.filter((r) => r.status === 'PENDING');

  const roleLabel: Record<string, string> = {
    MEMBER: 'Thành viên',
    LIBRARIAN: 'Thủ thư',
    ADMIN: 'Quản trị viên',
  };

  if (!user) {
    return (
      <div className="state-card">
        <div className="state-icon text-2xl"></div>
        <h2 className="text-xl font-bold text-ink-900">Bạn cần đăng nhập</h2>
        <p className="mt-1 text-sm text-ink-500">Vui lòng đăng nhập để xem hồ sơ của bạn.</p>
        <Link className="btn-primary mt-4" to="/login">Đăng nhập</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="font-semibold text-ink-900">Hồ sơ của tôi</span>
      </nav>

      {/* ===== HERO HỒ SƠ ===== */}
      <section className="panel overflow-hidden">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-3xl font-black text-white shadow-md">
            {user.memberCode.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="section-kicker">Tài khoản thành viên</p>
            <h1 className="mt-1 text-2xl font-black text-ink-900">{user.memberCode}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="tag">{roleLabel[user.role] ?? user.role}</span>
              {overdueLoans.length > 0 && (
                <span className="tag border-red-200 bg-red-50 text-red-600">
                   {overdueLoans.length} sách quá hạn
                </span>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="btn-danger shrink-0"
          >
            Đăng xuất
          </button>
        </div>
      </section>

      {/* ===== STATS CARDS (học từ profile.php) ===== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Đang mượn', value: activeLoans.length, icon: '', color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Quá hạn', value: overdueLoans.length, icon: '', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Đặt chỗ chờ', value: pendingReservations.length, icon: '', color: 'text-gold-600', bg: 'bg-gold-100' },
          { label: 'Tổng đã mượn', value: loans.length, icon: '', color: 'text-accent-600', bg: 'bg-accent-50' },
        ].map((stat) => (
          <div key={stat.label} className="panel flex flex-col items-center py-4 text-center">
            <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} text-xl`}>
              {stat.icon}
            </div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-ink-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ===== THÔNG TIN TÀI KHOẢN ===== */}
      <section className="panel">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-kicker">Thông tin</p>
            <h2 className="panel-title">Thông tin tài khoản</h2>
            <p className="panel-description">Thông tin cơ bản về tài khoản thư viện của bạn.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary text-sm px-3 py-1.5"
          >
            {isEditing ? 'Hủy' : ' Chỉnh sửa'}
          </button>
        </div>

        {isEditing ? (
          <form className="space-y-4" onSubmit={handleUpdateProfile}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="Nhập địa chỉ email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="btn-primary w-full py-2.5 mt-2"
            >
              {updateProfileMutation.isPending ? 'Đang lưu...' : ' Lưu thay đổi'}
            </button>
          </form>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Mã thành viên', value: user.memberCode, icon: '' },
                { label: 'Vai trò', value: roleLabel[user.role] ?? user.role, icon: '' },
                { label: 'Họ và tên', value: formData.fullName || '—', icon: '' },
                { label: 'Số điện thoại', value: formData.phone || '—', icon: '' },
                { label: 'Email', value: formData.email || '—', icon: '' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-slate-50 p-4">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="stat-label">{label}</p>
                    <p className="mt-1 font-semibold text-ink-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-700">
               Bấm vào nút <strong>Chỉnh sửa</strong> phía trên để tự cập nhật họ tên, số điện thoại và email cá nhân.
            </div>
          </>
        )}
      </section>

      {/* ===== THAO TÁC NHANH ===== */}
      <section className="panel">
        <p className="section-kicker">Thao tác</p>
        <h2 className="panel-title">Thao tác nhanh</h2>
        <p className="panel-description mb-5">Truy cập nhanh các tính năng thường dùng.</p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: '/san-pham', icon: '', label: 'Tìm kiếm sách', desc: 'Duyệt và mượn sách', primary: true },
            { to: '/lich-su', icon: '', label: 'Lịch sử mượn', desc: 'Xem các phiếu mượn sách' },
            ...(user.role === 'ADMIN' ? [{ to: '/admin', icon: '', label: 'Admin Dashboard', desc: 'Quản trị hệ thống', primary: true }] : []),
            ...(user.role === 'LIBRARIAN' ? [{ to: '/librarian/inventory', icon: '', label: 'Thủ thư Dashboard', desc: 'Quản lý kho sách', primary: true }] : []),
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${
                item.primary
                  ? 'border-primary-200 bg-primary-50 hover:border-primary-300 hover:bg-primary-100'
                  : 'border-border bg-white hover:border-primary-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className={`font-bold ${item.primary ? 'text-primary-700' : 'text-ink-900'}`}>{item.label}</p>
                <p className="text-xs text-ink-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sách đang mượn */}
      {activeLoans.length > 0 && (
        <section className="panel">
          <div className="panel-header mb-4">
            <div>
              <p className="section-kicker">Hiện tại</p>
              <h2 className="panel-title">Sách đang mượn</h2>
            </div>
            <Link to="/lich-su" className="btn-secondary shrink-0 text-sm">Xem tất cả →</Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Ngày mượn</th>
                  <th>Hạn trả</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.slice(0, 5).map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-semibold text-ink-900">
                      <Link to={`/lich-su/${loan.id}`} className="hover:text-primary-600">{loan.bookTitle}</Link>
                    </td>
                    <td className="text-ink-600">{new Date(loan.loanDate).toLocaleDateString('vi-VN')}</td>
                    <td className={new Date(loan.dueDate) < new Date() ? 'font-semibold text-red-600' : 'text-ink-600'}>
                      {new Date(loan.dueDate).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfilePage;
