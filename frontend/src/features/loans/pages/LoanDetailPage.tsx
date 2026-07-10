import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMyLoans } from '../api/useMyLoans';
import { useRenewLoan } from '../api/useRenewLoan';
import LoanStatusBadge from '../../../components/LoanStatusBadge';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const isOverdue = (dueDate: string, status: string) =>
  status === 'OVERDUE' || (status !== 'RETURNED' && new Date(dueDate) < new Date());

const calcFineDays = (dueDate: string) =>
  Math.max(0, Math.floor((Date.now() - new Date(dueDate).getTime()) / 86400000));

const STATUS_DESCRIPTIONS: Record<string, { label: string; desc: string; color: string }> = {
  ACTIVE: { label: 'Đang mượn', desc: 'Sách đang trong thời hạn mượn hợp lệ.', color: 'text-primary-600' },
  RETURNED: { label: 'Đã trả', desc: 'Sách đã được trả về thư viện.', color: 'text-accent-600' },
  OVERDUE: { label: 'Quá hạn', desc: 'Sách đã quá hạn trả. Vui lòng trả ngay để tránh phí phạt tăng thêm.', color: 'text-red-600' },
};

const LoanDetailPage: React.FC = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { data: loans, isLoading, isError } = useMyLoans();
  const renewLoanMutation = useRenewLoan();

  const loan = loans?.find((l) => l.id === Number(loanId));
  const overdue = loan ? isOverdue(loan.dueDate, loan.status) && loan.status !== 'RETURNED' : false;
  const fineDays = loan?.overdueDays ?? (loan && overdue ? calcFineDays(loan.dueDate) : 0);
  const fineAmount = loan?.fineAmount ?? (fineDays * 5000);

  const handleRenew = () => {
    if (!loan) return;
    renewLoanMutation.mutate(loan.id, {
      onSuccess: () => {
        alert('Gia hạn thành công!');
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || 'Không thể gia hạn sách này. Có thể bạn đã vượt quá số lần gia hạn cho phép.');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="state-card">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <p className="text-sm text-ink-500">Đang tải chi tiết phiếu mượn...</p>
      </div>
    );
  }

  if (isError || !loan) {
    return (
      <div className="state-card">
        <div className="state-icon text-2xl"></div>
        <h3 className="text-lg font-bold text-ink-900">Không tìm thấy phiếu mượn</h3>
        <p className="mt-1 text-sm text-ink-500">Phiếu mượn này không tồn tại hoặc không thuộc về bạn.</p>
        <Link className="btn-secondary mt-4" to="/lich-su">← Quay lại lịch sử</Link>
      </div>
    );
  }

  const statusInfo = STATUS_DESCRIPTIONS[loan.status] ?? { label: loan.status, desc: '', color: 'text-ink-600' };

  return (
    <div className="page-stack">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/lich-su" className="hover:text-primary-600 transition-colors">Lịch sử mượn</Link>
        <span>/</span>
        <span className="font-semibold text-ink-900">Phiếu #{loan.id}</span>
      </nav>

      {/* Alert quá hạn */}
      {overdue && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <span className="text-xl"></span>
          <div>
            <p className="font-bold text-red-700">Sách đã quá hạn {fineDays} ngày!</p>
            <p className="mt-1 text-sm text-red-600">
              Phí phạt hiện tại: <span className="font-black">{fineAmount.toLocaleString('vi-VN')}đ</span> (5.000đ/ngày). Vui lòng trả sách ngay để tránh phát sinh thêm.
            </p>
          </div>
        </div>
      )}

      {/* ===== 2 cột: thông tin phiếu + tóm tắt (học từ order-detail.php) ===== */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

        {/* Chi tiết phiếu mượn */}
        <div className="panel">
          <div className="panel-header border-b border-border pb-4">
            <div>
              <p className="section-kicker">Phiếu mượn</p>
              <h1 className="panel-title">#{loan.id} — {loan.bookTitle}</h1>
            </div>
            <LoanStatusBadge status={loan.status} />
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Tên sách', value: loan.bookTitle },
              { label: 'Mã phiếu mượn', value: `#${loan.id}`, mono: true },
              { label: 'Ngày mượn', value: formatDate(loan.loanDate) },
              { label: 'Hạn trả', value: formatDate(loan.dueDate), danger: overdue },
              { label: 'Ngày trả thực tế', value: loan.returnDate ? formatDate(loan.returnDate) : '— Chưa trả' },
              { label: 'Số lần gia hạn', value: `${loan.renewalCount} lần` },
            ].map(({ label, value, mono, danger }) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4">
                <dt className="stat-label">{label}</dt>
                <dd className={`mt-1 font-semibold ${mono ? 'font-mono text-sm' : ''} ${danger ? 'text-red-600' : 'text-ink-900'}`}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Trạng thái</p>
            <p className={`mt-1 font-bold ${statusInfo.color}`}>{statusInfo.label}</p>
            <p className="mt-1 text-sm text-ink-500">{statusInfo.desc}</p>
          </div>
        </div>

        {/* Tóm tắt phí (học từ checkout.php order summary col-md-4) */}
        <div className="flex flex-col gap-4">
          <div className="panel">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-700">Tóm tắt phí phạt</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Số ngày quá hạn</span>
                <span className="font-semibold text-ink-900">{fineDays} ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Đơn giá phạt</span>
                <span className="font-semibold text-ink-900">5.000đ/ngày</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-ink-900">Tổng phí phạt</span>
                  <span className={`text-lg font-black ${fineAmount > 0 ? 'text-red-600' : 'text-accent-600'}`}>
                    {fineAmount > 0 ? `${fineAmount.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-700">Hành động</h2>
            <div className="flex flex-col gap-2">
              {loan.status === 'ACTIVE' && (
                <button
                  onClick={handleRenew}
                  disabled={renewLoanMutation.isPending || overdue}
                  className="btn-accent text-center justify-center py-2.5 text-base"
                >
                  {renewLoanMutation.isPending ? 'Đang xử lý...' : ' Gia hạn mượn sách'}
                </button>
              )}
              <Link to="/san-pham" className="btn-primary text-center">
                 Mượn thêm sách
              </Link>
              <Link to="/lich-su" className="btn-secondary text-center">
                ← Quay lại lịch sử
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailPage;
