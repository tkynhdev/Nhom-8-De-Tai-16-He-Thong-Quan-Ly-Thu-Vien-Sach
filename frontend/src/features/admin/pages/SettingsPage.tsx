import React, { FormEvent, useEffect, useState } from 'react';
import { useFineConfig, useUpdateFineConfig } from '../api/useFineConfig';

const SettingsPage: React.FC = () => {
  const { data, isLoading, isError } = useFineConfig();
  const updateFineConfig = useUpdateFineConfig();
  const [fineRatePerDay, setFineRatePerDay] = useState('');
  const [loanDays, setLoanDays] = useState('');
  const [maxRenewalCount, setMaxRenewalCount] = useState('');

  useEffect(() => {
    if (data) {
      setFineRatePerDay(String(data.fineRatePerDay));
      setLoanDays(String(data.loanDays));
      setMaxRenewalCount(String(data.maxRenewalCount));
    }
  }, [data]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateFineConfig.mutate({
      fineRatePerDay: Number(fineRatePerDay),
      loanDays: Number(loanDays),
      maxRenewalCount: Number(maxRenewalCount),
    });
  };

  const fields = [
    {
      id: 'fineRatePerDay',
      label: 'Phí phạt mỗi ngày quá hạn',
      desc: 'Số tiền phạt tính theo đồng (VNĐ) cho mỗi ngày trễ hạn.',
      icon: '',
      value: fineRatePerDay,
      onChange: setFineRatePerDay,
      step: '1000',
      min: '0',
      unit: 'đ/ngày',
    },
    {
      id: 'loanDays',
      label: 'Số ngày mượn tối đa',
      desc: 'Thời hạn mượn sách mặc định tính từ ngày mượn.',
      icon: '',
      value: loanDays,
      onChange: setLoanDays,
      step: '1',
      min: '1',
      unit: 'ngày',
    },
    {
      id: 'maxRenewalCount',
      label: 'Số lần gia hạn tối đa',
      desc: 'Số lần thành viên được phép gia hạn mỗi phiếu mượn.',
      icon: '',
      value: maxRenewalCount,
      onChange: setMaxRenewalCount,
      step: '1',
      min: '0',
      unit: 'lần',
    },
  ];

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Cấu hình hệ thống</p>
            <h2 className="panel-title">Cài đặt thư viện</h2>
            <p className="panel-description">Cấu hình quy tắc mượn sách và mức phí phạt áp dụng cho tất cả thành viên.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="panel">
          <p className="section-kicker">Quy tắc mượn sách</p>
          <h3 className="panel-title">Chỉnh sửa cài đặt</h3>

          {isLoading ? (
            <div className="mt-6 flex items-center gap-3 text-sm text-ink-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-100 border-t-primary-600" />
              Đang tải cài đặt hiện tại...
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="form-label" htmlFor={field.id}>
                    {field.icon} {field.label}
                  </label>
                  <p className="mb-2 text-xs text-ink-500">{field.desc}</p>
                  <div className="flex items-center gap-3">
                    <input
                      id={field.id}
                      className="input-field"
                      type="number"
                      min={field.min}
                      step={field.step}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={isLoading}
                    />
                    <span className="shrink-0 text-sm font-semibold text-ink-500">{field.unit}</span>
                  </div>
                </div>
              ))}

              {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                   Không thể tải cài đặt hiện tại.
                </div>
              )}
              {updateFineConfig.isSuccess && (
                <div className="rounded-lg border border-accent-100 bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-700">
                   Đã lưu cài đặt thành công!
                </div>
              )}
              {updateFineConfig.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                   Không thể lưu cài đặt. Vui lòng thử lại.
                </div>
              )}

              <button
                className="btn-primary"
                type="submit"
                disabled={isLoading || updateFineConfig.isPending}
              >
                {updateFineConfig.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang lưu...
                  </span>
                ) : ' Lưu cài đặt'}
              </button>
            </form>
          )}
        </section>

        {/* Preview panel */}
        <section className="panel h-fit">
          <p className="section-kicker">Xem trước</p>
          <h3 className="panel-title">Quy tắc hiện tại</h3>
          <div className="mt-4 space-y-4">
            {[
              { icon: '', label: 'Phí phạt/ngày', value: fineRatePerDay ? `${Number(fineRatePerDay).toLocaleString('vi-VN')}đ` : '—' },
              { icon: '', label: 'Thời hạn mượn', value: loanDays ? `${loanDays} ngày` : '—' },
              { icon: '', label: 'Gia hạn tối đa', value: maxRenewalCount ? `${maxRenewalCount} lần` : '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <span>{icon}</span> {label}
                </div>
                <span className="text-sm font-bold text-ink-900">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-4 text-xs text-primary-700">
             Thay đổi cài đặt sẽ áp dụng ngay cho tất cả phiếu mượn mới. Phiếu mượn đang có hiệu lực không bị ảnh hưởng.
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
