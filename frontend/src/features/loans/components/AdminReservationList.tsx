import React from 'react';
import { AdminReservationData } from '../api/usePendingReservations';

interface AdminReservationListProps {
  reservations: AdminReservationData[];
}

const AdminReservationList: React.FC<AdminReservationListProps> = ({ reservations }) => {
  return (
    <div className="alert-card border-gold-200">
      <div className="alert-header">
        <div>
          <p className="section-kicker">Danh sách chờ</p>
          <h3 className="panel-title">Sách đang được đặt chỗ</h3>
          <p className="panel-description">
            Đang có {reservations.length} yêu cầu đặt chỗ cần được xử lý khi có sách trả về.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-xl">
          
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="state-card border-gold-100 bg-gold-50 text-gold-700">
          <div className="state-icon text-gold-600"></div>
          <h3 className="text-gold-800">Không có sách đang chờ</h3>
          <p className="text-gold-600">Hiện tại không có thành viên nào đang đợi sách.</p>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto pr-2">
          <ul className="alert-list divide-y divide-border">
            {reservations.map((res) => (
              <li key={res.id} className="p-4 transition-colors hover:bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-ink-900">{res.bookTitle}</p>
                    <p className="mt-1 text-sm text-ink-600">
                      Ngày đặt: {new Date(res.reservationDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="inline-flex rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-700 uppercase">
                      Đang đợi
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminReservationList;
