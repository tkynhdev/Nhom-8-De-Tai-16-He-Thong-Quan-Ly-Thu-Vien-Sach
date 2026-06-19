import React, { useState } from 'react';
import OverdueAlertList, { OverdueLoan } from '../components/OverdueAlertList';
import FineCalculator from '../../../components/FineCalculator';

const mockOverdueLoans: OverdueLoan[] = [
  {
    loanId: 101,
    bookTitle: 'Clean Architecture',
    memberCode: 'M-2891',
    memberName: 'Nguyen Van A',
    dueDate: '2026-06-10',
    overdueDays: 9,
  },
  {
    loanId: 102,
    bookTitle: 'Design Patterns',
    memberCode: 'M-1024',
    memberName: 'Tran Thi B',
    dueDate: '2026-06-15',
    overdueDays: 4,
  },
];

const ProcessReturnsPage: React.FC = () => {
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

  const handleProcessFine = (loanId: number) => {
    setSelectedLoanId(loanId);
  };

  const handleConfirmFine = (amount: number, reason: string) => {
    console.log(`Processing fine for loan ${selectedLoanId}: ${amount} VND - ${reason}`);
    alert(`Successfully processed fine of ${amount} VND.`);
    setSelectedLoanId(null);
  };

  const selectedLoan = mockOverdueLoans.find((l) => l.loanId === selectedLoanId) || null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold">Returns &amp; Fines Processing</h2>
        <p className="text-sm text-gray-600 mt-1">
          Scan returned books and manage overdue penalties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverdueAlertList loans={mockOverdueLoans} onProcessFine={handleProcessFine} />
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
