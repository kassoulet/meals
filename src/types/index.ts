// src/types/index.ts

// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Household types
export interface Household {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  max_members: number;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: string;
  created_at: string;
}

// Meal types
export interface Meal {
  id: string;
  household_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Slot types
export interface Slot {
  id: string;
  household_id: string;
  date: string; // ISO date string
  slot_type: 'lunch' | 'dinner';
  is_active: boolean;
  meal_id: string | null;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

// Form types
export interface MealFormValues {
  name: string;
  description?: string;
}

export interface HouseholdFormValues {
  name: string;
}

// Shuffle types
export interface ShuffleRequest {
  household_id: string;
  start_date: string;
  end_date: string;
}

export interface ShuffleResponse {
  success: boolean;
  updated_slots: Slot[];
  duplicate_count: number;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}