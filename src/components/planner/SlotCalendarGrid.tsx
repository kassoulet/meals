// src/components/planner/SlotCalendarGrid.tsx
import { useState, useEffect } from 'react';
import { Slot } from '@/types';
import { dateUtils } from '@/lib/utils';
import SlotCell from './SlotCell';

interface SlotCalendarGridProps {
  slots: Slot[];
  meals: any[];
  householdId: string;
  startDate?: Date;
  onSlotUpdate?: (slot: Slot) => void;
  onSlotToggle: (slotId: string, updates: Partial<Slot>) => void;
  onSlotAssignMeal: (slotId: string, mealId: string | null) => void;
}

export default function SlotCalendarGrid({
  slots,
  meals,
  householdId,
  startDate: initialDate,
  onSlotUpdate,
  onSlotToggle,
  onSlotAssignMeal
}: SlotCalendarGridProps) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  
  // Calculate the week dates when the current date changes
  useEffect(() => {
    const weekStart = dateUtils.getWeekStart(currentDate);
    const dates = dateUtils.getWeekDates(weekStart);
    setWeekDates(dates);
  }, [currentDate]);

  // Move to the next week
  const nextWeek = () => {
    setCurrentDate(prev => {
      const nextWeekDate = new Date(prev);
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      return nextWeekDate;
    });
  };

  // Move to the previous week
  const prevWeek = () => {
    setCurrentDate(prev => {
      const prevWeekDate = new Date(prev);
      prevWeekDate.setDate(prevWeekDate.getDate() - 7);
      return prevWeekDate;
    });
  };

  // Move to the current week
  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  // Get slots for the current week
  const getSlotsForDate = (date: Date) => {
    const dateStr = dateUtils.formatDate(date);
    return slots.filter(slot => slot.date === dateStr);
  };

  // Get slots for a specific date and slot type
  const getSlotForDateAndType = (date: Date, slotType: 'lunch' | 'dinner') => {
    const dateStr = dateUtils.formatDate(date);
    return slots.find(slot =>
      slot.date === dateStr &&
      slot.slot_type === slotType
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Meal Planner
          </h3>
          <div className="flex items-center">
            <button
              onClick={prevWeek}
              className="ml-2 inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              onClick={goToCurrentWeek}
              className="ml-2 inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Today
            </button>
            <button
              onClick={nextWeek}
              className="ml-2 inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {dateUtils.formatReadableDate(dateUtils.getWeekStart(currentDate))} -{' '}
          {dateUtils.formatReadableDate(dateUtils.getWeekEnd(currentDate))}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 p-4">
        {weekDates.map((date, index) => {
          const dateStr = dateUtils.formatDate(date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = date.getDate();

          // Get slots for this date
          const dateSlots = getSlotsForDate(date);

          return (
            <div key={dateStr} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
              <div className="text-center font-medium text-gray-700 dark:text-gray-300">
                {dayName} {dayNumber}
              </div>

              <div className="mt-2 space-y-2">
                {/* Lunch slot */}
                <SlotCell
                  slot={getSlotForDateAndType(date, 'lunch')}
                  slotType="lunch"
                  date={date}
                  meals={meals}
                  onToggle={onSlotToggle}
                  onAssignMeal={onSlotAssignMeal}
                />

                {/* Dinner slot */}
                <SlotCell
                  slot={getSlotForDateAndType(date, 'dinner')}
                  slotType="dinner"
                  date={date}
                  meals={meals}
                  onToggle={onSlotToggle}
                  onAssignMeal={onSlotAssignMeal}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}