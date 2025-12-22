// Environment configuration
// This file contains all environment-specific configurations

// Supabase configuration
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// Validation to ensure required environment variables are present
if (typeof window === 'undefined') { // Server-side only
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

// Application configuration
export const APP_CONFIG = {
  // Maximum number of members per household
  MAX_HOUSEHOLD_MEMBERS: 10,
  
  // Meal name character limits
  MIN_MEAL_NAME_LENGTH: 3,
  MAX_MEAL_NAME_LENGTH: 50,
  
  // Meal description character limit
  MAX_MEAL_DESCRIPTION_LENGTH: 500,
  
  // Planning horizon (in weeks)
  PLANNING_HORIZON_WEEKS: 4,
  
  // Shuffle operation timeout (in seconds)
  SHUFFLE_TIMEOUT_SECONDS: 3,
  
  // Backup retention period (in days)
  BACKUP_RETENTION_DAYS: 30,
  
  // Inactive household retention period (in days)
  INACTIVE_HOUSEHOLD_RETENTION_DAYS: 90,
  
  // Minimum touch target size (for accessibility)
  MIN_TOUCH_TARGET_SIZE_PX: 44,
};