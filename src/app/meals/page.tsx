// src/app/meals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMeals } from '@/hooks/useMeals';
import { useHouseholds } from '@/hooks/useHouseholds';
import { useRouter } from 'next/navigation';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import MealForm from '@/components/meals/MealForm';
import MealList from '@/components/meals/MealList';

export default function MealsPage() {
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const router = useRouter();

  const {
    meals,
    loading,
    error,
    addMeal,
    updateMeal,
    deleteMeal
  } = useMeals(selectedHouseholdId || undefined);

  const { households } = useHouseholds();

  const handleSaveMeal = async (mealData: any) => {
    if (editingMeal) {
      // Update existing meal
      await updateMeal(editingMeal.id, mealData);
    } else {
      // Create new meal
      if (selectedHouseholdId) {
        await addMeal({ ...mealData, household_id: selectedHouseholdId });
      }
    }
    setShowForm(false);
    setEditingMeal(null);
  };

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal);
    setShowForm(true);
  };

  const handleDeleteMeal = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      await deleteMeal(id);
    }
  };

  const handleNewMeal = () => {
    setEditingMeal(null);
    setShowForm(true);
  };

  if (!selectedHouseholdId && households.length > 0) {
    setSelectedHouseholdId(households[0].id);
  }

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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Meal Pool</h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Manage the shared pool of meals for your household.
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
                <button
                  type="button"
                  onClick={handleNewMeal}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 sm:w-auto"
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
              {error}
            </div>
          )}

          {showForm ? (
            <div className="mt-8">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {editingMeal
                        ? 'Update the details for this meal.'
                        : 'Add a new meal to your household pool.'}
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <MealForm
                    meal={editingMeal}
                    householdId={selectedHouseholdId || undefined}
                    onSave={handleSaveMeal}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingMeal(null);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
              ) : (
                <MealList
                  meals={meals}
                  onEdit={handleEditMeal}
                  onDelete={handleDeleteMeal}
                  onSelectHousehold={setSelectedHouseholdId}
                  selectedHouseholdId={selectedHouseholdId}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}