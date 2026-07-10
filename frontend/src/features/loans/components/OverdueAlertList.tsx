import React, { useMemo } from 'react';
import LoanStatusBadge from '../../../components/LoanStatusBadge';

export interface OverdueLoan {
  loanId: number;
  bookTitle: string;
  memberCode: string;
  memberName: string;
  dueDate: string;
  overdueDays: number;
}

interface OverdueAlertListProps {
  loans: OverdueLoan[];
  onProcessFine?: (loanId: number) => void;
}

const OverdueAlertList: React.FC<OverdueAlertListProps> = ({ loans, onProcessFine }) => {
  const sortedLoans = useMemo(
    () => [...loans].sort((a, b) => b.overdueDays - a.overdueDays),
    [loans]
  );

  return (
    <div className="alert-card">
      <div className="alert-header">
        <div>
          <p className="section-kicker">Cần chú ý</p>
          <h3 className="panel-title">Sách quá hạn</h3>
          <p className="panel-description">
            Đang có {sortedLoans.length} phiếu mượn cần xử lý quá hạn.
          </p>
        </div>
        <LoanStatusBadge status="OVERDUE" />
      </div>

      {sortedLoans.length === 0 ? (
        <div className="state-card border-accent-100 bg-accent-50 text-accent-700">
          <div className="state-icon text-accent-600"></div>
          <h3 className="text-accent-800">Không có sách quá hạn</h3>
          <p className="text-accent-600">Tất cả phiếu mượn đang trong thời hạn cho phép.</p>
        </div>
      ) : (
        <ul className="alert-list divide-y divide-red-100">
          {sortedLoans.map((loan) => (
            <li key={loan.loanId} className="p-4 hover:bg-red-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-ink-900">{loan.bookTitle}</p>
                  <p className="mt-1 text-sm text-ink-600">
                    <span className="font-semibold text-ink-800">{loan.memberName}</span> ({loan.memberCode}) - Hạn trả: {new Date(loan.dueDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                    Trễ {loan.overdueDays} ngày
                  </span>
                  {onProcessFine && (
                    <button
                      className="btn-danger py-1.5 px-3 text-xs"
                      type="button" onClick={() => onProcessFine(loan.loanId)}
                    >
                      Xử lý phạt
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OverdueAlertList;
