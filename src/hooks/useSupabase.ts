// src/hooks/useSupabase.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle async operations with loading and error states
  const executeWithState = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Supabase operation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    executeWithState,
    supabase
  };
};