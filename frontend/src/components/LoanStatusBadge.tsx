import React from 'react';

type BadgeStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'RESERVED' | 'AVAILABLE' | 'LOANED' | 'LOST';

interface LoanStatusBadgeProps {
  status: BadgeStatus | string;
}

const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'AVAILABLE':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'OVERDUE':
    case 'LOST':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'RETURNED':
      bgColor = 'bg-slate-100';
      textColor = 'text-slate-600';
      break;
    case 'RESERVED':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      break;
    case 'LOANED':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
};

export default LoanStatusBadge;
