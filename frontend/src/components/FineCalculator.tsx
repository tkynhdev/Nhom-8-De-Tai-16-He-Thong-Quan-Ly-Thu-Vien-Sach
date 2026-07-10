import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface FineCalculatorProps {
  baseRatePerDay?: number;
  initialOverdueDays?: number;
  onConfirm?: (amount: number, reason: string) => void;
}

interface FineFormInputs {
  overdueDays: number;
  reason: string;
}

const FineCalculator: React.FC<FineCalculatorProps> = ({
  baseRatePerDay = 5000,
  initialOverdueDays = 0,
  onConfirm,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FineFormInputs>({
    defaultValues: {
      overdueDays: Math.max(0, initialOverdueDays),
      reason: initialOverdueDays > 0 ? `Phạt quá hạn ${initialOverdueDays} ngày` : '',
    },
  });

  const watchDays = watch('overdueDays', 0);
  const totalFine = watchDays * baseRatePerDay;

  useEffect(() => {
    if (watchDays > 0) {
      setValue('reason', `Phạt quá hạn ${watchDays} ngày`);
    } else {
      setValue('reason', 'Không cần nộp phạt');
    }
  }, [watchDays, setValue]);

  const onSubmit = (data: FineFormInputs) => {
    if (onConfirm && data.overdueDays > 0) {
      onConfirm(data.overdueDays * baseRatePerDay, data.reason);
    }
  };

  return (
    <div className="panel border-red-200">
      <div className="panel-header border-b border-red-100 bg-red-50 p-4 rounded-t-xl">
        <div>
          <p className="section-kicker text-red-600">Công cụ tính phí</p>
          <h3 className="panel-title text-red-800">Tính tiền phạt</h3>
          <p className="panel-description text-red-700">Tự động tính phí dựa trên số ngày trễ hạn.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <div>
          <label className="form-label">Số ngày quá hạn</label>
          <Controller
            name="overdueDays"
            control={control}
            rules={{ min: { value: 0, message: 'Số ngày không thể âm' } }}
            render={({ field }) => <input {...field} type="number" min="0" className="input-field" />}
          />
          {errors.overdueDays && <p className="mt-1 text-xs font-semibold text-red-600">{errors.overdueDays.message}</p>}
        </div>

        <div>
          <label className="form-label">Lý do thu tiền</label>
          <Controller
            name="reason"
            control={control}
            rules={{ required: watchDays > 0 ? 'Vui lòng nhập lý do' : false }}
            render={({ field }) => (
              <input {...field} type="text" disabled={watchDays === 0} className="input-field" />
            )}
          />
          {errors.reason && <p className="mt-1 text-xs font-semibold text-red-600">{errors.reason.message}</p>}
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink-600">Tổng tiền phạt:</span>
            <span className="text-2xl font-black text-red-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalFine)}
            </span>
          </div>
          <p className="mt-1 text-right text-xs text-ink-500">Mức phí: {baseRatePerDay.toLocaleString('vi-VN')} đ/ngày</p>
        </div>

        <button type="submit" disabled={watchDays <= 0} className="btn-danger w-full justify-center py-2.5 text-base">
          Xác nhận tạo biên lai phạt
        </button>
      </form>
    </div>
  );
};

export default FineCalculator;
