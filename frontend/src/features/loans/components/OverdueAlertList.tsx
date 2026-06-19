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
  const sortedLoans = useMemo(() => {
    return [...loans].sort((a, b) => b.overdueDays - a.overdueDays);
  }, [loans]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-red-100">
      <div className="px-4 py-5 sm:px-6 bg-red-50 border-b border-red-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-red-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Overdue Books Alert
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-red-600">
            Action required: {sortedLoans.length} items are currently overdue.
          </p>
        </div>
      </div>

      {sortedLoans.length === 0 ? (
        <div className="p-6 text-center text-gray-500">Hooray! No overdue books at the moment.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedLoans.map((loan) => (
            <li key={loan.loanId} className="hover:bg-gray-50 transition-colors">
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 truncate">{loan.bookTitle}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <LoanStatusBadge status="OVERDUE" />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="sm:flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {loan.memberName} ({loan.memberCode})
                      </div>
                      <div className="mt-2 flex items-center text-sm text-red-600 sm:mt-0 sm:ml-6 font-medium">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-4 w-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {loan.overdueDays} days late
                      </div>
                    </div>
                    {onProcessFine && (
                      <button
                        onClick={() => onProcessFine(loan.loanId)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Process Fine
                      </button>
                    )}
                  </div>
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
