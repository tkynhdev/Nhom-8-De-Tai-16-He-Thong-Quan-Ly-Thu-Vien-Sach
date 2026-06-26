import React from 'react';
import PopularBooksChart from '../components/PopularBooksChart';
import { useStatisticsOverview } from '../api/useStatisticsOverview';

const ReportsPage: React.FC = () => {
  const { data, isLoading, isError } = useStatisticsOverview();

  const formatCurrency = (value: number = 0) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold">Library Reports</h2>
        <p className="text-sm text-gray-600 mt-1">
          Overview of library operations and statistics for the current month.
        </p>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load report data from the backend.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Active Loans</div>
          <div className="text-2xl font-bold">{data?.totalActiveLoans ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Overdue Books</div>
          <div className="text-2xl font-bold">{data?.totalOverdue ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Available Copies</div>
          <div className="text-2xl font-bold">{data?.availableCopies ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Fines Collected</div>
          <div className="text-2xl font-bold">{formatCurrency(data?.monthlyFinesCollected)}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Top Borrowed Books</h3>
        <PopularBooksChart data={data?.popularBooks ?? []} isLoading={isLoading} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Top Active Members</h3>
        {(data?.topMembers ?? []).length === 0 ? (
          <p className="text-sm text-gray-500">No member activity data yet.</p>
        ) : (
          <ul className="space-y-3">
            {(data?.topMembers ?? []).map((member) => (
              <li key={member.memberCode} className="text-sm text-gray-600">
                {member.fullName} ({member.memberCode}) borrowed {member.loanCount} books
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
