// src/lib/validations/index.ts
import { MealFormValues, HouseholdFormValues } from '@/types';

// Validation utilities
export const validationUtils = {
  // Validate household name (3-50 characters)
  validateHouseholdName: (name: string): { isValid: boolean; error?: string } => {
    if (!name || name.trim().length < 3) {
      return { 
        isValid: false, 
        error: 'Household name must be at least 3 characters long' 
      };
    }
    
    if (name.length > 50) {
      return { 
        isValid: false, 
        error: 'Household name must be no more than 50 characters long' 
      };
    }
    
    return { isValid: true };
  },

  // Validate meal name (3-50 characters)
  validateMealName: (name: string): { isValid: boolean; error?: string } => {
    if (!name || name.trim().length < 3) {
      return { 
        isValid: false, 
        error: 'Meal name must be at least 3 characters long' 
      };
    }
    
    if (name.length > 50) {
      return { 
        isValid: false, 
        error: 'Meal name must be no more than 50 characters long' 
      };
    }
    
    return { isValid: true };
  },

  // Validate meal description (up to 500 characters)
  validateMealDescription: (description?: string): { isValid: boolean; error?: string } => {
    if (description && description.length > 500) {
      return { 
        isValid: false, 
        error: 'Meal description must be no more than 500 characters long' 
      };
    }
    
    return { isValid: true };
  },

  // Validate household form values
  validateHouseholdForm: (data: HouseholdFormValues): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    const nameValidation = validationUtils.validateHouseholdName(data.name);
    if (!nameValidation.isValid && nameValidation.error) {
      errors.push(nameValidation.error);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate meal form values
  validateMealForm: (data: MealFormValues): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    const nameValidation = validationUtils.validateMealName(data.name);
    if (!nameValidation.isValid && nameValidation.error) {
      errors.push(nameValidation.error);
    }
    
    const descriptionValidation = validationUtils.validateMealDescription(data.description);
    if (!descriptionValidation.isValid && descriptionValidation.error) {
      errors.push(descriptionValidation.error);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate date is within 4 weeks from current date
  validateDateRange: (dateString: string): { isValid: boolean; error?: string } => {
    const date = new Date(dateString);
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(currentDate.getDate() + 28); // 4 weeks
    
    if (isNaN(date.getTime())) {
      return { 
        isValid: false, 
        error: 'Invalid date format' 
      };
    }
    
    if (date < currentDate) {
      return { 
        isValid: false, 
        error: 'Date cannot be in the past' 
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

// Validation hook for React components
export const useFormValidation = () => {
  return {
    validate: validationUtils
  };
};