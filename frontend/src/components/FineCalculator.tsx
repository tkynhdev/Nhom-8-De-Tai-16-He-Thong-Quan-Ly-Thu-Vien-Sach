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
      reason: initialOverdueDays > 0 ? `Overdue for ${initialOverdueDays} days` : '',
    },
  });

  const watchDays = watch('overdueDays', 0);
  const totalFine = watchDays * baseRatePerDay;

  useEffect(() => {
    if (watchDays > 0) {
      setValue('reason', `Overdue for ${watchDays} days`);
    } else {
      setValue('reason', 'No fine needed');
    }
  }, [watchDays, setValue]);

  const onSubmit = (data: FineFormInputs) => {
    if (onConfirm && data.overdueDays > 0) {
      onConfirm(data.overdueDays * baseRatePerDay, data.reason);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 w-full max-w-md">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Fine Calculator
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overdue Days</label>
          <Controller
            name="overdueDays"
            control={control}
            rules={{ min: { value: 0, message: 'Days cannot be negative' } }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            )}
          />
          {errors.overdueDays && (
            <p className="mt-1 text-sm text-red-600">{errors.overdueDays.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <Controller
            name="reason"
            control={control}
            rules={{ required: watchDays > 0 ? 'Reason is required' : false }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                disabled={watchDays === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
              />
            )}
          />
          {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Fine:</span>
            <span className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                totalFine
              )}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1">
            Rate: {baseRatePerDay.toLocaleString()} VND/day
          </p>
        </div>

        <button
          type="submit"
          disabled={watchDays <= 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Confirm Fine Creation
        </button>
      </form>
    </div>
  );
};

export default FineCalculator;
