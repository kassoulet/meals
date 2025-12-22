// src/components/planner/SlotCell.tsx
import { useState } from 'react';
import { Slot } from '@/types';

interface SlotCellProps {
  slot?: Slot;
  slotType: 'lunch' | 'dinner';
  date: Date;
  meals: any[];
  onToggle: (slotId: string, updates: Partial<Slot>) => void;
  onAssignMeal: (slotId: string, mealId: string | null) => void;
}

export default function SlotCell({ 
  slot, 
  slotType, 
  date, 
  meals, 
  onToggle, 
  onAssignMeal 
}: SlotCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(slot?.meal_id || null);
  
  // Determine the slot state for styling
  const getSlotState = () => {
    if (!slot) return 'empty'; // No slot exists for this date/type
    if (!slot.is_active) return 'inactive';
    if (slot.meal_id) return 'filled';
    return 'empty-active';
  };
  
  const slotState = getSlotState();
  
  // Handle meal assignment
  const handleAssignMeal = () => {
    if (slot) {
      onAssignMeal(slot.id, selectedMealId);
      setIsEditing(false);
    }
  };
  
  // Handle toggling active state
  const handleToggleActive = () => {
    if (slot) {
      onToggle(slot.id, { is_active: !slot.is_active });
    }
  };
  
  // Handle clearing meal assignment
  const handleClearMeal = () => {
    if (slot) {
      onAssignMeal(slot.id, null);
    }
  };
  
  // Get meal name if meal is assigned
  const mealName = meals.find(meal => meal.id === slot?.meal_id)?.name || '';
  
  // Determine CSS classes based on state
  const getStateClasses = () => {
    switch (slotState) {
      case 'filled':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'empty-active':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'inactive':
        return 'bg-gray-200 border-gray-300 text-gray-500 line-through';
      case 'empty':
        return 'bg-white border-gray-300 text-gray-500';
      default:
        return 'bg-white border-gray-300 text-gray-500';
    }
  };
  
  return (
    <div className={`border rounded-md p-2 min-h-[80px] ${getStateClasses()}`}>
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium">
          {slotType === 'lunch' ? 'Lunch' : 'Dinner'}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={handleToggleActive}
            className={`text-xs px-1.5 py-0.5 rounded ${
              slot?.is_active 
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            title={slot?.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
          >
            {slot?.is_active ? 'ON' : 'OFF'}
          </button>
          {slotState === 'filled' && (
            <button
              onClick={handleClearMeal}
              className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded hover:bg-red-200"
              title="Clear meal assignment"
            >
              X
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-1">
        {isEditing ? (
          <div className="space-y-2">
            <select
              value={selectedMealId || ''}
              onChange={(e) => setSelectedMealId(e.target.value || null)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select a meal...</option>
              {meals.map(meal => (
                <option key={meal.id} value={meal.id}>
                  {meal.name}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleAssignMeal}
                className="flex-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : slotState === 'filled' ? (
          <div 
            className="text-sm cursor-pointer hover:bg-opacity-50"
            onClick={() => setIsEditing(true)}
          >
            <span className="font-medium">{mealName}</span>
          </div>
        ) : slotState === 'empty-active' ? (
          <div 
            className="text-sm cursor-pointer hover:bg-opacity-50"
            onClick={() => setIsEditing(true)}
          >
            <span className="italic">Click to assign meal</span>
          </div>
        ) : slotState === 'inactive' ? (
          <div className="text-sm">
            <span className="italic">Inactive</span>
          </div>
        ) : (
          <div className="text-sm">
            <span className="italic">No slot</span>
          </div>
        )}
      </div>
    </div>
  );
}