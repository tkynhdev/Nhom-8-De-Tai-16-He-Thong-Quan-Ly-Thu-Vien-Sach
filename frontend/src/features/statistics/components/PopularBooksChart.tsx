import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export interface ChartData {
  title: string;
  borrowCount: number;
}

interface PopularBooksChartProps {
  data: ChartData[];
  isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

const PopularBooksChart: React.FC<PopularBooksChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-gray-500 animate-pulse font-medium">Loading chart data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <span className="text-gray-500">No borrowing data available for this month.</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Top 5 Popular Books This Month</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="title"
              type="category"
              axisLine={false}
              tickLine={false}
              width={150}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="borrowCount" radius={[0, 4, 4, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PopularBooksChart;
