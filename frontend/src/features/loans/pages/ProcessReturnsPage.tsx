import React, { FormEvent, useMemo, useState } from 'react';
import ActiveLoanList, { ActiveLoanData } from '../components/ActiveLoanList';
import AdminReservationList from '../components/AdminReservationList';
import FineCalculator from '../../../components/FineCalculator';
import { useActiveLoans } from '../api/useActiveLoans';
import { usePendingReservations } from '../api/usePendingReservations';
import { useReturnBook } from '../api/useReturnBook';
import { useBorrowCopy, useReturnByCopyCode } from '../api/useCirculation';
import { LoanResponse } from '../../../types/api';

type Receipt = {
  type: 'BORROW' | 'RETURN';
  loan: LoanResponse;
};

const escapeHtml = (value: unknown) => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(value ?? '').replace(/[&<>"']/g, (char) => map[char] || char);
};

const ProcessReturnsPage: React.FC = () => {
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [memberCode, setMemberCode] = useState('');
  const [borrowCopyCode, setBorrowCopyCode] = useState('');
  const [returnCopyCode, setReturnCopyCode] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [fineMessage, setFineMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { data: activeLoansData, isLoading, isError } = useActiveLoans();
  const { data: pendingReservationsData = [], isLoading: isLoadingReservations } = usePendingReservations();
  const returnBookMutation = useReturnBook();
  const borrowCopy = useBorrowCopy();
  const returnByCopyCode = useReturnByCopyCode();

  const mappedLoans: ActiveLoanData[] = useMemo(() => {
    if (!activeLoansData) return [];
    const now = new Date();
    return activeLoansData.map((loan: LoanResponse) => {
      const dueDate = new Date(loan.dueDate);
      const diffTime = now.getTime() - dueDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        loanId: loan.id,
        bookTitle: loan.bookTitle,
        memberCode: loan.memberCode || 'Khách',
        memberName: loan.memberName || 'Khách',
        dueDate: loan.dueDate.split('T')[0],
        status: loan.status,
        overdueDays: (loan.status === 'OVERDUE' || diffDays > 0) ? Math.max(diffDays, 0) : 0,
      };
    });
  }, [activeLoansData]);

  const handleBorrowSubmit = (event: FormEvent) => {
    event.preventDefault();
    borrowCopy.mutate(
      { memberCode: memberCode.trim(), copyCode: borrowCopyCode.trim() },
      {
        onSuccess: (loan) => {
          setReceipt({ type: 'BORROW', loan });
          setMemberCode('');
          setBorrowCopyCode('');
        },
      }
    );
  };

  const handleReturnSubmit = (event: FormEvent) => {
    event.preventDefault();
    returnByCopyCode.mutate(returnCopyCode.trim(), {
      onSuccess: (loan) => {
        setReceipt({ type: 'RETURN', loan });
        setReturnCopyCode('');
      },
    });
  };

  const printReceipt = () => {
    if (!receipt) return;
    const { loan, type } = receipt;
    const win = window.open('', '_blank', 'width=420,height=640');
    if (!win) return;
    const member = `${loan.memberCode || ''} ${loan.memberName || ''}`.trim();
    const typeLabel = type === 'BORROW' ? 'MƯỢN SÁCH' : 'TRẢ SÁCH';
    
    win.document.write(`
      <html>
        <head>
          <title>Biên nhận ${typeLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            .header { text-align: center; margin-bottom: 24px; border-bottom: 2px dashed #ccc; padding-bottom: 16px; }
            h1 { font-size: 20px; margin: 0 0 8px; font-weight: bold; }
            h2 { font-size: 16px; margin: 0; color: #4b5563; }
            p { margin: 8px 0; font-size: 14px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .label { font-weight: bold; color: #4b5563; }
            .value { font-weight: 600; text-align: right; }
            .muted { color: #6b7280; font-size: 12px; margin-top: 32px; text-align: center; }
            .footer { margin-top: 24px; border-top: 2px dashed #ccc; padding-top: 16px; text-align: center; font-style: italic; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>THƯ VIỆN LIBSYS</h1>
            <h2>BIÊN NHẬN ${typeLabel}</h2>
          </div>
          
          <div class="item">
            <span class="label">Mã phiếu:</span>
            <span class="value">#${loan.id}</span>
          </div>
          <div class="item">
            <span class="label">Thành viên:</span>
            <span class="value">${escapeHtml(member)}</span>
          </div>
          <div class="item">
            <span class="label">Tên sách:</span>
            <span class="value">${escapeHtml(loan.bookTitle)}</span>
          </div>
          
          <div style="margin: 16px 0; border-bottom: 1px solid #eee;"></div>
          
          <div class="item">
            <span class="label">Ngày mượn:</span>
            <span class="value">${escapeHtml(new Date(loan.loanDate!).toLocaleString('vi-VN'))}</span>
          </div>
          <div class="item">
            <span class="label">Hạn trả:</span>
            <span class="value">${escapeHtml(new Date(loan.dueDate!).toLocaleDateString('vi-VN'))}</span>
          </div>
          ${loan.returnDate ? `
          <div class="item">
            <span class="label">Ngày trả:</span>
            <span class="value">${escapeHtml(new Date(loan.returnDate).toLocaleString('vi-VN'))}</span>
          </div>` : ''}
          <div class="item">
            <span class="label">Trạng thái:</span>
            <span class="value">${loan.status}</span>
          </div>
          
          <div class="footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
          </div>
          <p class="muted">In lúc: ${escapeHtml(new Date().toLocaleString('vi-VN'))}</p>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  const handleConfirmFine = (amount: number) => {
    if (!selectedLoanId) return;
    setFineMessage(null);
    returnBookMutation.mutate(selectedLoanId, {
      onSuccess: () => {
        setFineMessage({
          type: 'success',
          text: ` Trả sách thành công. Đã thu phí phạt ${amount.toLocaleString('vi-VN')} đ.`,
        });
        setSelectedLoanId(null);
      },
      onError: (err: any) => {
        setFineMessage({
          type: 'error',
          text: ` Lỗi trả sách: ${err.response?.data?.message || err.message}`,
        });
      },
    });
  };

  const handleProcessReturn = (loanId: number) => {
    const loan = mappedLoans.find(l => l.loanId === loanId);
    if (!loan) return;
    if (loan.overdueDays > 0) {
      setSelectedLoanId(loanId);
    } else {
      setSelectedLoanId(null);
      returnBookMutation.mutate(loanId, {
        onSuccess: () => {
          setFineMessage({ type: 'success', text: ` Trả sách thành công (Phiếu #${loanId}).` });
        },
        onError: (err: any) => {
          setFineMessage({ type: 'error', text: ` Lỗi trả sách: ${err.response?.data?.message || err.message}` });
        },
      });
    }
  };

  const selectedLoan = mappedLoans.find((loan) => loan.loanId === selectedLoanId) || null;
  const borrowError = (borrowCopy.error as any)?.response?.data?.message;
  const returnError = (returnByCopyCode.error as any)?.response?.data?.message;

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Quầy giao dịch</p>
            <h2 className="panel-title">Mượn / Trả sách bằng mã vạch</h2>
            <p className="panel-description">
              Sử dụng máy quét mã vạch (USB scanner) hoặc nhập mã thủ công để thao tác mượn/trả nhanh chóng.
            </p>
          </div>
          {mappedLoans.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
               {mappedLoans.length} phiếu quá hạn
            </span>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Borrow Panel */}
        <section className="panel border-primary-200">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 text-xl"></div>
            <h3 className="text-lg font-bold text-ink-900">Cho mượn sách</h3>
          </div>
          <form className="space-y-4" onSubmit={handleBorrowSubmit}>
            <div>
              <label className="form-label">Mã thành viên</label>
              <input
                className="input-field"
                placeholder="VD: MV001"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Mã vạch bản sao (Copy Code)</label>
              <input
                className="input-field bg-slate-50 focus:bg-white"
                placeholder="Quét mã vạch sách..."
                value={borrowCopyCode}
                onChange={(e) => setBorrowCopyCode(e.target.value)}
                required
                autoFocus
              />
            </div>
            
            {borrowError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600"> {borrowError}</div>
            )}
            {borrowCopy.isSuccess && (
              <div className="rounded-lg bg-accent-50 p-3 text-sm text-accent-700 font-semibold"> Mượn sách thành công!</div>
            )}
            
            <button className="btn-primary w-full justify-center py-2.5 text-base" type="submit" disabled={borrowCopy.isPending}>
              {borrowCopy.isPending ? 'Đang xử lý...' : 'Xác nhận mượn'}
            </button>
          </form>
        </section>

        {/* Return Panel */}
        <section className="panel border-accent-200">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600 text-xl"></div>
            <h3 className="text-lg font-bold text-ink-900">Nhận trả sách</h3>
          </div>
          <form className="space-y-4" onSubmit={handleReturnSubmit}>
            <div>
              <label className="form-label">Mã vạch bản sao (Copy Code)</label>
              <input
                className="input-field bg-slate-50 focus:bg-white"
                placeholder="Quét mã vạch sách..."
                value={returnCopyCode}
                onChange={(e) => setReturnCopyCode(e.target.value)}
                required
              />
            </div>
            
            {returnError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600"> {returnError}</div>
            )}
            {returnByCopyCode.isSuccess && (
              <div className="rounded-lg bg-accent-50 p-3 text-sm text-accent-700 font-semibold"> Trả sách thành công!</div>
            )}
            
            <button className="btn-accent w-full justify-center py-2.5 text-base" type="submit" disabled={returnByCopyCode.isPending}>
              {returnByCopyCode.isPending ? 'Đang xử lý...' : 'Xác nhận trả'}
            </button>
          </form>
        </section>
      </div>

      {/* Receipt Panel */}
      {receipt && (
        <section className="panel animate-fade-in border-gold-200 bg-gold-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-2xl"></div>
              <div>
                <h3 className="text-lg font-bold text-gold-900">
                  {receipt.type === 'BORROW' ? 'Đã tạo biên nhận mượn sách' : 'Đã tạo biên nhận trả sách'}
                </h3>
                <p className="text-sm font-semibold text-gold-700">
                  Phiếu #{receipt.loan.id} - {receipt.loan.memberCode} - {receipt.loan.bookTitle}
                </p>
              </div>
            </div>
            <button className="rounded-xl bg-white px-4 py-2 font-bold text-gold-700 shadow-sm hover:bg-gold-100 border border-gold-200" onClick={printReceipt}>
               In biên nhận ngay
            </button>
          </div>
        </section>
      )}

      {/* Fine message */}
      {fineMessage && (
        <div className={`panel font-semibold ${fineMessage.type === 'success' ? 'border-accent-200 bg-accent-50 text-accent-700' : 'border-red-200 bg-red-50 text-red-600'}`}>
          {fineMessage.text}
        </div>
      )}

      {/* Overdue/Fine section */}
      {isLoading ? (
        <div className="panel text-center text-ink-500">Đang tải danh sách mượn trả...</div>
      ) : isError ? (
        <div className="panel text-center text-red-600">Lỗi khi tải danh sách phiếu mượn.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActiveLoanList 
            loans={mappedLoans} 
            onProcessReturn={handleProcessReturn} 
            isProcessing={returnBookMutation.isPending}
          />

          {selectedLoan ? (
            <FineCalculator
              baseRatePerDay={5000}
              initialOverdueDays={selectedLoan.overdueDays}
              onConfirm={handleConfirmFine}
            />
          ) : (
            <div className="state-card border-slate-200 bg-slate-50">
              <div className="state-icon text-slate-400"></div>
              <h3 className="text-slate-700">Công cụ tính phí phạt</h3>
              <p className="text-slate-500">Chọn một phiếu mượn bên danh sách quá hạn để tính phí nộp phạt.</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Reservations */}
      <div className="mt-6">
        {isLoadingReservations ? (
          <div className="panel text-center text-ink-500">Đang tải danh sách chờ...</div>
        ) : (
          <AdminReservationList reservations={pendingReservationsData} />
        )}
      </div>
    </div>
  );
};

export default ProcessReturnsPage;
