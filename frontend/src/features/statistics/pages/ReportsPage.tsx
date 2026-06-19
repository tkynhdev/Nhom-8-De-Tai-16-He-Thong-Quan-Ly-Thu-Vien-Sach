import React from 'react';
import PopularBooksChart, { ChartData } from '../components/PopularBooksChart';

const mockChartData: ChartData[] = [
  { title: 'Spring Boot in Action', borrowCount: 45 },
  { title: 'Clean Code', borrowCount: 38 },
  { title: 'React Documentation', borrowCount: 30 },
  { title: 'Design Patterns', borrowCount: 25 },
  { title: 'System Design Interview', borrowCount: 15 },
];

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold">Library Reports</h2>
        <p className="text-sm text-gray-600 mt-1">
          Overview of library operations and statistics for the current month.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Active Loans</div>
          <div className="text-2xl font-bold">152</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Overdue Books</div>
          <div className="text-2xl font-bold">14</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Available Copies</div>
          <div className="text-2xl font-bold">1,024</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500">Fines Collected (VND)</div>
          <div className="text-2xl font-bold">250,000</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Top Borrowed Books</h3>
        <PopularBooksChart data={mockChartData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <li key={item} className="text-sm text-gray-600">
              Loan #{1000 + item} returned — Processed 10 minutes ago by Admin
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportsPage;
