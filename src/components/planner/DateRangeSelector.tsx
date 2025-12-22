// src/components/planner/DateRangeSelector.tsx
import { useState, useEffect } from 'react';
import { dateUtils } from '@/lib/utils';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export default function DateRangeSelector({ 
  startDate, 
  endDate, 
  onDateRangeChange 
}: DateRangeSelectorProps) {
  const [localStartDate, setLocalStartDate] = useState<string>(dateUtils.formatDate(startDate));
  const [localEndDate, setLocalEndDate] = useState<string>(dateUtils.formatDate(endDate));

  // Update local state when props change
  useEffect(() => {
    setLocalStartDate(dateUtils.formatDate(startDate));
    setLocalEndDate(dateUtils.formatDate(endDate));
  }, [startDate, endDate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setLocalStartDate(e.target.value);
    onDateRangeChange(newDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setLocalEndDate(e.target.value);
    onDateRangeChange(startDate, newDate);
  };

  return (
    <div className="flex items-center space-x-4">
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          id="start-date"
          value={localStartDate}
          onChange={handleStartDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          value={localEndDate}
          onChange={handleEndDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
}