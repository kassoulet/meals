// src/app/planner/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSlots } from '@/hooks/useSlots';
import { useMeals } from '@/hooks/useMeals';
import { useHouseholds } from '@/hooks/useHouseholds';
import { dateUtils } from '@/lib/utils';
import SlotCalendarGrid from '@/components/planner/SlotCalendarGrid';
import DateRangeSelector from '@/components/planner/DateRangeSelector';
import ShuffleButton from '@/components/planner/ShuffleButton';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { useRouter } from 'next/navigation';

export default function PlannerPage() {
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(dateUtils.getWeekStart(new Date()));
  const router = useRouter();

  // Get dates for the current week
  const weekDates = dateUtils.getWeekDates(currentWeekStart);
  const startDate = dateUtils.formatDate(weekDates[0]);
  const endDate = dateUtils.formatDate(weekDates[6]);

  // Fetch slots for the current week
  const {
    slots,
    loading: slotsLoading,
    error: slotsError,
    updateSlot,
    batchUpdateSlots
  } = useSlots(selectedHouseholdId || undefined, startDate, endDate);

  // Fetch meals for the household
  const {
    meals,
    loading: mealsLoading,
    error: mealsError
  } = useMeals(selectedHouseholdId || undefined);

  // Fetch households
  const { households } = useHouseholds();

  // Handle shuffle operation
  const handleShuffle = async (householdId: string, start: string, end: string) => {
    // This would typically call a shuffle API endpoint
    // For now, we'll just simulate the shuffle with the existing hooks
    console.log('Shuffling meals for household:', householdId, 'from', start, 'to', end);
    
    // Find all empty active slots
    const emptyActiveSlots = slots.filter(slot => 
      slot.is_active && !slot.meal_id
    );
    
    if (emptyActiveSlots.length === 0) {
      alert('No empty active slots to fill!');
      return;
    }
    
    if (meals.length === 0) {
      alert('No meals available to assign!');
      return;
    }
    
    // Shuffle meals for the empty slots
    const shuffledMeals = [...meals].sort(() => Math.random() - 0.5);
    const updates = [];
    
    for (let i = 0; i < emptyActiveSlots.length; i++) {
      const slot = emptyActiveSlots[i];
      const meal = shuffledMeals[i % shuffledMeals.length]; // Cycle through meals if more slots than meals
      
      updates.push({
        id: slot.id,
        updates: { meal_id: meal.id }
      });
    }
    
    // Batch update the slots
    await batchUpdateSlots(updates);
  };

  // Navigation for weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(dateUtils.getWeekStart(new Date()));
  };

  // Set default household if available
  useEffect(() => {
    if (!selectedHouseholdId && households.length > 0) {
      setSelectedHouseholdId(households[0].id);
    }
  }, [selectedHouseholdId, households]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                ← Back
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">MealFill</h1>
            </div>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Planner</h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Plan your meals for the upcoming week.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <div className="flex space-x-4">
                <select
                  value={selectedHouseholdId || ''}
                  onChange={(e) => setSelectedHouseholdId(e.target.value || null)}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {households.map((household) => (
                    <option key={household.id} value={household.id}>
                      {household.name}
                    </option>
                  ))}
                </select>
                <ShuffleButton
                  householdId={selectedHouseholdId || ''}
                  startDate={startDate}
                  endDate={endDate}
                  onShuffle={handleShuffle}
                  disabled={!selectedHouseholdId || slotsLoading || mealsLoading}
                />
              </div>
            </div>
          </div>

          {(slotsError || mealsError) && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
              {slotsError || mealsError}
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={goToPreviousWeek}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous
                </button>
                <button
                  onClick={goToCurrentWeek}
                  className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Today
                </button>
                <button
                  onClick={goToNextWeek}
                  className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {dateUtils.formatReadableDate(weekDates[0])} - {dateUtils.formatReadableDate(weekDates[6])}
              </div>
            </div>

            {slotsLoading || mealsLoading ? (
              <div className="flex justify-center items-center h-64 mt-8">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
              </div>
            ) : (
              <div className="mt-6">
                <SlotCalendarGrid
                  slots={slots}
                  meals={meals}
                  householdId={selectedHouseholdId || ''}
                  startDate={currentWeekStart}
                  onSlotUpdate={updateSlot}
                  onSlotToggle={(slotId, updates) => updateSlot(slotId, updates)}
                  onSlotAssignMeal={(slotId, mealId) => updateSlot(slotId, { meal_id: mealId })}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}