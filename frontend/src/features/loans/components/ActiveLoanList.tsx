import React, { useMemo } from 'react';
import LoanStatusBadge from '../../../components/LoanStatusBadge';

export interface ActiveLoanData {
  loanId: number;
  bookTitle: string;
  memberCode: string;
  memberName: string;
  dueDate: string;
  status: string;
  overdueDays: number;
}

interface ActiveLoanListProps {
  loans: ActiveLoanData[];
  onProcessReturn?: (loanId: number) => void;
  isProcessing?: boolean;
}

const ActiveLoanList: React.FC<ActiveLoanListProps> = ({ loans, onProcessReturn, isProcessing }) => {
  const sortedLoans = useMemo(
    () => [...loans].sort((a, b) => b.overdueDays - a.overdueDays),
    [loans]
  );

  const overdueCount = sortedLoans.filter(l => l.overdueDays > 0).length;

  return (
    <div className="alert-card">
      <div className="alert-header">
        <div>
          <p className="section-kicker">Quản lý mượn trả</p>
          <h3 className="panel-title">Tất cả sách chưa trả</h3>
          <p className="panel-description">
            Đang có {sortedLoans.length} phiếu mượn cần thu hồi, trong đó {overdueCount} phiếu quá hạn.
          </p>
        </div>
      </div>

      {sortedLoans.length === 0 ? (
        <div className="state-card border-accent-100 bg-accent-50 text-accent-700">
          <div className="state-icon text-accent-600"></div>
          <h3 className="text-accent-800">Không có sách cần thu hồi</h3>
          <p className="text-accent-600">Tất cả sách mượn đều đã được trả.</p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto pr-2">
          <ul className="alert-list divide-y divide-border">
            {sortedLoans.map((loan) => (
              <li key={loan.loanId} className={`p-4 transition-colors ${loan.overdueDays > 0 ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-slate-50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink-900">{loan.bookTitle}</p>
                      {loan.overdueDays > 0 && <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase">Quá hạn</span>}
                    </div>
                    <p className="mt-1 text-sm text-ink-600">
                      <span className="font-semibold text-ink-800">{loan.memberName}</span> ({loan.memberCode}) - Hạn trả: {new Date(loan.dueDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {loan.overdueDays > 0 && (
                      <span className="text-xs font-bold text-red-600">
                        Trễ {loan.overdueDays} ngày
                      </span>
                    )}
                    {onProcessReturn && (
                      <button
                        className="btn-primary py-2 px-4 text-sm whitespace-nowrap"
                        type="button" 
                        onClick={() => onProcessReturn(loan.loanId)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Đang trả...' : ' Nhận trả'}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActiveLoanList;
