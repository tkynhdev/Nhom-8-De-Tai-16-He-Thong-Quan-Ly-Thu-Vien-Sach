import React, { useMemo, useState } from 'react';
import OverdueAlertList, { OverdueLoan } from '../components/OverdueAlertList';
import FineCalculator from '../../../components/FineCalculator';
import { useOverdueLoans } from '../api/useOverdueLoans';
import { useReturnBook } from '../api/useReturnBook';

const ProcessReturnsPage: React.FC = () => {
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const { data: loans = [], isLoading, isError } = useOverdueLoans();
  const returnBookMutation = useReturnBook();

  const overdueLoans = useMemo<OverdueLoan[]>(
    () =>
      loans.map((loan) => ({
        loanId: loan.id,
        bookTitle: loan.bookTitle,
        memberCode: loan.memberCode ?? 'UNKNOWN',
        memberName: loan.memberCode ?? 'UNKNOWN',
        dueDate: loan.dueDate,
        overdueDays: loan.overdueDays ?? 0,
      })),
    [loans]
  );

  const handleProcessFine = (loanId: number) => {
    setSelectedLoanId(loanId);
  };

  const handleConfirmFine = () => {
    if (!selectedLoanId) {
      return;
    }

    returnBookMutation.mutate(selectedLoanId, {
      onSuccess: () => setSelectedLoanId(null),
    });
  };

  const selectedLoan = overdueLoans.find((loan) => loan.loanId === selectedLoanId) || null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold">Returns &amp; Fines Processing</h2>
        <p className="text-sm text-gray-600 mt-1">
          Scan returned books and manage overdue penalties.
        </p>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load overdue loans from the backend.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
              Loading overdue loans...
            </div>
          ) : (
            <OverdueAlertList loans={overdueLoans} onProcessFine={handleProcessFine} />
          )}
        </div>

        <div>
          {selectedLoan ? (
            <FineCalculator
              baseRatePerDay={5000}
              initialOverdueDays={selectedLoan.overdueDays}
              onConfirm={handleConfirmFine}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900">Select an overdue record</h3>
              <p className="mt-2 text-sm text-gray-500">
                Click "Process Fine" from the list to calculate penalties.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessReturnsPage;
