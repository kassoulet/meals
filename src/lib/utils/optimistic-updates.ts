// src/lib/utils/optimistic-updates.ts
import { useState } from 'react';
import { Slot, Meal, Household } from '@/types';

// Optimistic update utilities for UI responsiveness
export const optimisticUpdateUtils = {
  // Optimistic updates for slots
  slots: {
    // Optimistically update a single slot
    updateSlot: (currentSlots: Slot[], id: string, updates: Partial<Slot>): Slot[] => {
      return currentSlots.map(slot => 
        slot.id === id ? { ...slot, ...updates, updated_at: new Date().toISOString() } : slot
      );
    },

    // Optimistically add a new slot
    addSlot: (currentSlots: Slot[], newSlot: Slot): Slot[] => {
      return [...currentSlots, newSlot];
    },

    // Optimistically remove a slot
    removeSlot: (currentSlots: Slot[], id: string): Slot[] => {
      return currentSlots.filter(slot => slot.id !== id);
    },

    // Optimistically update multiple slots
    batchUpdateSlots: (currentSlots: Slot[], updates: { id: string; updates: Partial<Slot> }[]): Slot[] => {
      const updatedSlots = [...currentSlots];
      for (const update of updates) {
        const index = updatedSlots.findIndex(slot => slot.id === update.id);
        if (index !== -1) {
          updatedSlots[index] = { 
            ...updatedSlots[index], 
            ...update.updates, 
            updated_at: new Date().toISOString() 
          };
        }
      }
      return updatedSlots;
    }
  },

  // Optimistic updates for meals
  meals: {
    // Optimistically update a single meal
    updateMeal: (currentMeals: Meal[], id: string, updates: Partial<Meal>): Meal[] => {
      return currentMeals.map(meal => 
        meal.id === id ? { ...meal, ...updates, updated_at: new Date().toISOString() } : meal
      );
    },

    // Optimistically add a new meal
    addMeal: (currentMeals: Meal[], newMeal: Meal): Meal[] => {
      return [...currentMeals, newMeal];
    },

    // Optimistically remove a meal
    removeMeal: (currentMeals: Meal[], id: string): Meal[] => {
      return currentMeals.filter(meal => meal.id !== id);
    }
  },

  // Optimistic updates for households
  households: {
    // Optimistically update a single household
    updateHousehold: (currentHouseholds: Household[], id: string, updates: Partial<Household>): Household[] => {
      return currentHouseholds.map(household => 
        household.id === id ? { ...household, ...updates, updated_at: new Date().toISOString() } : household
      );
    },

    // Optimistically add a new household
    addHousehold: (currentHouseholds: Household[], newHousehold: Household): Household[] => {
      return [...currentHouseholds, newHousehold];
    },

    // Optimistically remove a household
    removeHousehold: (currentHouseholds: Household[], id: string): Household[] => {
      return currentHouseholds.filter(household => household.id !== id);
    }
  }
};

// React hook for managing optimistic updates
export const useOptimisticUpdates = <T, U extends Partial<T>>(initialItems: T[], idField: keyof T = 'id' as keyof T) => {
  const [optimisticItems, setOptimisticItems] = useState<T[]>(initialItems);

  const applyOptimisticUpdate = (id: any, updates: U) => {
    setOptimisticItems(prev => 
      prev.map(item => 
        (item as any)[idField] === id ? { ...item, ...updates } : item
      )
    );
  };

  const applyOptimisticAdd = (newItem: T) => {
    setOptimisticItems(prev => [...prev, newItem]);
  };

  const applyOptimisticRemove = (id: any) => {
    setOptimisticItems(prev => 
      prev.filter(item => (item as any)[idField] !== id)
    );
  };

  const resetOptimisticUpdates = () => {
    setOptimisticItems(initialItems);
  };

  return {
    optimisticItems,
    applyOptimisticUpdate,
    applyOptimisticAdd,
    applyOptimisticRemove,
    resetOptimisticUpdates
  };
};