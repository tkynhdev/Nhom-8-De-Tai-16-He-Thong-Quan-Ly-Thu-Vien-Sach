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

const COLORS = ['#0f766e', '#2563eb', '#f59e0b', '#ef6f6c', '#64748b'];

const PopularBooksChart: React.FC<PopularBooksChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="state-card">
        <div className="spinner" />
        <h3>Loading chart data</h3>
        <p>Preparing the most borrowed titles.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="state-card">
        <div className="state-icon">▥</div>
        <h3>No borrowing data</h3>
        <p>Borrowing activity will appear here once loans are recorded.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Top demand</p>
          <h3 className="panel-title">Top Borrowed Books This Month</h3>
        </div>
      </div>
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 12, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#e6dccd" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="title"
              type="category"
              axisLine={false}
              tickLine={false}
              width={160}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: '#f6efe4' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e6dccd',
                boxShadow: '0 12px 26px rgba(64, 47, 25, 0.12)',
              }}
            />
            <Bar dataKey="borrowCount" radius={[0, 6, 6, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.title}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PopularBooksChart;
