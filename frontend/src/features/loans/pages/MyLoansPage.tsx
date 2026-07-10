import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyLoans } from '../api/useMyLoans';
import { useMyReservations } from '../api/useReserveBook';
import { useCancelReservation } from '../api/useCancelReservation';
import LoanStatusBadge from '../../../components/LoanStatusBadge';

type TabKey = 'all' | 'active' | 'overdue' | 'returned' | 'reserved';

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'all', label: 'Tất cả', emoji: '' },
  { key: 'active', label: 'Đang mượn', emoji: '' },
  { key: 'overdue', label: 'Quá hạn', emoji: '' },
  { key: 'returned', label: 'Đã trả', emoji: '' },
  { key: 'reserved', label: 'Đặt chỗ', emoji: '' },
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const isOverdue = (dueDate: string, status: string) =>
  status === 'OVERDUE' || (status !== 'RETURNED' && new Date(dueDate) < new Date());

const calcFine = (loan: any) => {
  if (loan.fineAmount !== undefined && loan.fineAmount !== null) {
    return loan.fineAmount > 0 ? `${loan.fineAmount.toLocaleString('vi-VN')}đ` : null;
  }
  const days = loan.overdueDays ?? Math.max(0, Math.floor((Date.now() - new Date(loan.dueDate).getTime()) / 86400000));
  return days > 0 ? `${(days * 5000).toLocaleString('vi-VN')}đ` : null;
};

const MyLoansPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const { data: loans, isLoading, isError } = useMyLoans();
  const { data: reservations = [] } = useMyReservations();
  const cancelReservationMutation = useCancelReservation();

  const filteredLoans = (loans ?? []).filter((loan) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return loan.status === 'ACTIVE' && !isOverdue(loan.dueDate, loan.status);
    if (activeTab === 'overdue') return isOverdue(loan.dueDate, loan.status) && loan.status !== 'RETURNED';
    if (activeTab === 'returned') return loan.status === 'RETURNED';
    return false;
  });

  const pendingReservations = reservations.filter((r) => r.status === 'PENDING');

  const tabData: Record<TabKey, number> = {
    all: (loans ?? []).length,
    active: (loans ?? []).filter((l) => l.status === 'ACTIVE' && !isOverdue(l.dueDate, l.status)).length,
    overdue: (loans ?? []).filter((l) => isOverdue(l.dueDate, l.status) && l.status !== 'RETURNED').length,
    returned: (loans ?? []).filter((l) => l.status === 'RETURNED').length,
    reserved: pendingReservations.length,
  };

  if (isLoading) {
    return (
      <div className="state-card">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <h3 className="text-lg font-bold text-ink-900">Đang tải lịch sử</h3>
        <p className="mt-1 text-sm text-ink-500">Đang kiểm tra lịch sử mượn sách...</p>
      </div>
    );
  }

  if (isError) {
    return <div className="state-card border-red-200 bg-red-50 text-red-700">Chưa thể tải lịch sử mượn sách. Vui lòng thử lại.</div>;
  }

  return (
    <div className="page-stack">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="font-semibold text-ink-900">Lịch sử mượn sách</span>
      </nav>

      {/* Header */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Hoạt động</p>
            <h1 className="panel-title">Lịch sử mượn sách</h1>
            <p className="panel-description">Theo dõi ngày mượn, hạn trả, trạng thái và đặt chỗ của bạn.</p>
          </div>
          <Link to="/san-pham" className="btn-primary shrink-0">+ Mượn thêm sách</Link>
        </div>

        {/* Stats mini */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Đang mượn', value: tabData.active, color: 'text-primary-600' },
            { label: 'Quá hạn', value: tabData.overdue, color: 'text-red-600' },
            { label: 'Đặt chỗ chờ', value: tabData.reserved, color: 'text-gold-600' },
            { label: 'Đã trả', value: tabData.returned, color: 'text-accent-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-slate-50 p-3 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TABS (học từ purchase-history.php) ===== */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-ink-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            {tabData[tab.key] > 0 && (
              <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs font-bold ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-ink-600'
              }`}>
                {tabData[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===== NỘI DUNG TAB ===== */}

      {/* Tab Đặt chỗ */}
      {activeTab === 'reserved' && (
        pendingReservations.length === 0 ? (
          <div className="state-card">
            <div className="state-icon text-xl"></div>
            <h3 className="text-lg font-bold text-ink-900">Chưa có đặt chỗ nào</h3>
            <p className="mt-1 text-sm text-ink-500">Đặt chỗ sách khi sách đang được mượn bởi người khác.</p>
            <Link to="/san-pham" className="btn-primary mt-4">Xem danh sách sách</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Ngày đặt chỗ</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold text-ink-900">{r.bookTitle}</td>
                    <td>{formatDate(r.reservationDate)}</td>
                    <td>
                      <span className="tag border-gold-100 bg-gold-100 text-gold-600">⏳ Đang chờ</span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn hủy đặt chỗ này?')) {
                            cancelReservationMutation.mutate(r.id, {
                              onSuccess: () => alert('Hủy đặt chỗ thành công!'),
                              onError: (err: any) => alert(err.response?.data?.message || 'Không thể hủy đặt chỗ lúc này.')
                            });
                          }
                        }}
                        disabled={cancelReservationMutation.isPending}
                        className="btn-danger inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
                      >
                        Hủy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Tab mượn/trả/quá hạn/tất cả */}
      {activeTab !== 'reserved' && (
        filteredLoans.length === 0 ? (
          <div className="state-card">
            <div className="state-icon text-xl"></div>
            <h3 className="text-lg font-bold text-ink-900">Chưa có dữ liệu</h3>
            <p className="mt-1 text-sm text-ink-500">Sách đã mượn sẽ hiển thị tại đây.</p>
            <Link to="/san-pham" className="btn-primary mt-4">Mượn sách ngay</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Ngày mượn</th>
                  <th>Hạn trả</th>
                  <th>Ngày trả</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Phí phạt</th>
                  <th className="text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => {
                  const overdue = isOverdue(loan.dueDate, loan.status);
                  const fine = overdue && loan.status !== 'RETURNED' ? calcFine(loan) : null;
                  return (
                    <tr key={loan.id} className={overdue && loan.status !== 'RETURNED' ? 'bg-red-50/50' : ''}>
                      <td>
                        <span className="font-semibold text-ink-900">{loan.bookTitle}</span>
                        {loan.renewalCount > 0 && (
                          <span className="ml-2 text-xs text-ink-400">Gia hạn: {loan.renewalCount}x</span>
                        )}
                      </td>
                      <td className="text-ink-600">{formatDate(loan.loanDate)}</td>
                      <td className={overdue && loan.status !== 'RETURNED' ? 'font-semibold text-red-600' : 'text-ink-600'}>
                        {formatDate(loan.dueDate)}
                      </td>
                      <td className="text-ink-600">
                        {loan.returnDate ? formatDate(loan.returnDate) : <span className="text-ink-400">—</span>}
                      </td>
                      <td>
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="text-right font-mono text-sm font-semibold text-red-600">
                        {fine ?? <span className="text-ink-400">—</span>}
                      </td>
                      <td className="text-right">
                        <Link
                          to={`/lich-su/${loan.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
                        >
                          Xem →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default MyLoansPage;
