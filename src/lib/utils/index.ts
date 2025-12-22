// src/lib/utils/index.ts
import { Slot, Meal } from '@/types';

// Date utility functions
export const dateUtils = {
  // Get the start of the current week (Monday)
  getWeekStart: (date: Date = new Date()): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  },

  // Get the end of the current week (Sunday)
  getWeekEnd: (date: Date = new Date()): Date => {
    const start = dateUtils.getWeekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  },

  // Get an array of dates for the current week
  getWeekDates: (date: Date = new Date()): Date[] => {
    const start = dateUtils.getWeekStart(date);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  },

  // Format date as YYYY-MM-DD
  formatDate: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // Format date as a readable string
  formatReadableDate: (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  },

  // Check if two dates are the same day
  isSameDay: (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  },

  // Add days to a date
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  // Validate date range
  validateDateRange: (dateString: string): { isValid: boolean; error?: string } => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: 'Invalid date format'
      };
    }

    // Check if date is within acceptable range (e.g., not too far in the past/future)
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(currentDate.getDate() + 28); // 4 weeks ahead

    if (date < new Date('2020-01-01')) { // Reasonable lower bound
      return {
        isValid: false,
        error: 'Date is too far in the past'
      };
    }

    if (date > maxDate) {
      return {
        isValid: false,
        error: 'Date must be within 4 weeks from today'
      };
    }

    return { isValid: true };
  }
};

// Shuffle utility functions
export const shuffleUtils = {
  // Fisher-Yates shuffle algorithm
  fisherYatesShuffle: <T>(array: T[]): T[] => {
    const result = [...array]; // Create a copy to avoid mutating the original
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  // Shuffle meals for slots without duplication within the same week
  shuffleMealsForSlots: (meals: Meal[], slots: Slot[]): { updatedSlots: Slot[]; duplicateCount: number } => {
    // Filter out slots that are active and empty
    const emptySlots = slots.filter(slot => slot.is_active && slot.meal_id === null);

    if (emptySlots.length === 0) {
      return { updatedSlots: slots, duplicateCount: 0 };
    }

    if (meals.length === 0) {
      // No meals to assign, return original slots
      return { updatedSlots: slots, duplicateCount: 0 };
    }

    // Shuffle the meals
    const shuffledMeals = shuffleUtils.fisherYatesShuffle(meals);

    // Create a new array of slots with meals assigned
    let mealIndex = 0;
    let duplicateCount = 0;
    const updatedSlots = slots.map(slot => {
      if (slot.is_active && slot.meal_id === null) {
        // Assign a meal to this empty slot
        const mealToAssign = shuffledMeals[mealIndex % shuffledMeals.length];

        // If we're reusing meals (more empty slots than meals), increment duplicate count
        if (mealIndex >= shuffledMeals.length) {
          duplicateCount++;
        }

        mealIndex++;
        return {
          ...slot,
          meal_id: mealToAssign.id
        };
      }
      return slot;
    });

    return { updatedSlots, duplicateCount };
  }
};

// General utility functions
export const generalUtils = {
  // Generate a unique ID
  generateId: (): string => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>): void => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Deep clone an object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  }
};