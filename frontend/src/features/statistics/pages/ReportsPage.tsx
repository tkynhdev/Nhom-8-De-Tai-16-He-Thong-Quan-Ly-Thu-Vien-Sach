import React from 'react';
import PopularBooksChart from '../components/PopularBooksChart';
import { useStatistics } from '../api/useStatistics';
import apiClient from '../../../lib/apiClient';
import useAuth from '../../../hooks/useAuth';

const ReportsPage: React.FC = () => {
  const { data: statsData, isLoading } = useStatistics();
  const { user } = useAuth();
  const chartData = statsData?.popularBookChart ?? [];

  const downloadCsv = async (name: string) => {
    const response = await apiClient.get(`/admin/exports/${name}.csv`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = [
    { icon: '', label: 'Đang mượn', value: statsData?.totalActiveLoans ?? '0', color: 'text-primary-600', bg: 'bg-primary-50' },
    { icon: '', label: 'Quá hạn', value: statsData?.totalOverdue ?? '0', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: '', label: 'Bản có sẵn', value: statsData?.availableCopies ?? '0', color: 'text-accent-600', bg: 'bg-accent-50' },
    { icon: '', label: 'Tiền phạt tháng này', value: statsData?.monthlyFinesCollected ? `${(statsData.monthlyFinesCollected / 1000).toFixed(0)}K đ` : '0', color: 'text-gold-600', bg: 'bg-gold-100' },
  ];

  if (isLoading) {
    return (
      <div className="state-card">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <p className="text-sm text-ink-500">Đang tải báo cáo...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Thống kê vận hành</p>
            <h2 className="panel-title">Báo cáo thư viện</h2>
            <p className="panel-description">
              Thống kê hàng tháng về mượn trả, sách quá hạn, tiền phạt và nhu cầu đầu sách.
            </p>
          </div>
          <div className="toolbar flex-wrap">
            <button className="btn-secondary" type="button" onClick={() => downloadCsv('books')}>
               Xuất danh sách sách
            </button>
            <button className="btn-secondary" type="button" onClick={() => downloadCsv('loans')}>
               Xuất lịch sử mượn
            </button>
            {user?.role === 'ADMIN' && (
              <button className="btn-secondary" type="button" onClick={() => downloadCsv('members')}>
                 Xuất thành viên
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} text-xl`}>
              {stat.icon}
            </div>
            <p className="stat-label">{stat.label}</p>
            <p className={`mt-2 text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <PopularBooksChart data={chartData} />
    </div>
  );
};

export default ReportsPage;
