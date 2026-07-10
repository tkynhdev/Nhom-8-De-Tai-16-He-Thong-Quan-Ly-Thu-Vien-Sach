import React from 'react';

type BadgeStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'RESERVED' | 'AVAILABLE' | 'LOANED' | 'LOST' | 'PENDING';

interface LoanStatusBadgeProps {
  status: BadgeStatus | string;
}

const getBadgeConfig = (status: string) => {
  const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ";
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return { class: baseClass + 'bg-primary-50 text-primary-700 border border-primary-200', label: 'Đang mượn' };
    case 'AVAILABLE':
      return { class: baseClass + 'bg-accent-50 text-accent-700 border border-accent-100', label: 'Có sẵn' };
    case 'OVERDUE':
      return { class: baseClass + 'bg-red-50 text-red-700 border border-red-200', label: 'Quá hạn' };
    case 'LOST':
      return { class: baseClass + 'bg-red-50 text-red-700 border border-red-200', label: 'Mất sách' };
    case 'RESERVED':
    case 'PENDING':
      return { class: baseClass + 'bg-gold-100 text-gold-700 border border-gold-200', label: 'Đặt chỗ chờ' };
    case 'LOANED':
      return { class: baseClass + 'bg-blue-50 text-blue-700 border border-blue-200', label: 'Đã mượn' };
    case 'RETURNED':
      return { class: baseClass + 'bg-slate-100 text-slate-600 border border-slate-200', label: 'Đã trả' };
    default:
      return { class: baseClass + 'bg-slate-100 text-slate-600 border border-slate-200', label: status };
  }
};

const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ status }) => {
  const config = getBadgeConfig(status);
  return <span className={config.class}>{config.label}</span>;
};

export default LoanStatusBadge;
