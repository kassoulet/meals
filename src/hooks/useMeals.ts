// src/hooks/useMeals.ts
import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { Meal } from '@/types';
import { optimisticUpdateUtils } from '@/lib/utils/optimistic-updates';

export const useMeals = (householdId?: string) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const { executeWithState, supabase } = useSupabase();

  const fetchMeals = useCallback(async () => {
    if (!householdId) return;

    const result = await executeWithState(async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('household_id', householdId);

      if (error) throw error;
      return data as Meal[];
    });

    if (result) {
      setMeals(result);
    }
  }, [executeWithState, householdId, supabase]);

  const addMeal = useCallback(async (meal: Omit<Meal, 'id' | 'created_at' | 'updated_at'>) => {
    // Optimistically add the meal
    const optimisticMeal = {
      ...meal,
      id: `optimistic-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Meal;

    setMeals(prev => [...prev, optimisticMeal]);

    try {
      const result = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('meals')
          .insert([meal])
          .select()
          .single();

        if (error) throw error;
        return data as Meal;
      });

      if (result) {
        // Replace the optimistic meal with the actual one
        setMeals(prev => prev.map(m =>
          m.id === optimisticMeal.id ? result : m
        ));
        return result;
      }
      return null;
    } catch (error) {
      // If the API call fails, remove the optimistic meal
      setMeals(prev => prev.filter(m => m.id !== optimisticMeal.id));
      throw error;
    }
  }, [executeWithState, supabase]);

  const updateMeal = useCallback(async (id: string, updates: Partial<Meal>) => {
    // Optimistically update the meal
    setMeals(prev => optimisticUpdateUtils.meals.updateMeal(prev, id, updates));

    try {
      const result = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('meals')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Meal;
      });

      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      // If the API call fails, revert the optimistic update
      const originalMeal = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('meals')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as Meal;
      });

      if (originalMeal) {
        setMeals(prev =>
          prev.map(m => m.id === id ? originalMeal : m)
        );
      }
      throw error;
    }
  }, [executeWithState, supabase]);

  const deleteMeal = useCallback(async (id: string) => {
    // Optimistically remove the meal
    setMeals(prev => optimisticUpdateUtils.meals.removeMeal(prev, id));

    try {
      const result = await executeWithState(async () => {
        const { error } = await supabase
          .from('meals')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { success: true };
      });

      if (result?.success) {
        return true;
      }
      return false;
    } catch (error) {
      // If the API call fails, add the meal back
      const originalMeal = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('meals')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as Meal;
      });

      if (originalMeal) {
        setMeals(prev => [...prev, originalMeal]);
      }
      throw error;
    }
  }, [executeWithState, supabase]);

  useEffect(() => {
    if (householdId) {
      fetchMeals();
    }
  }, [householdId, fetchMeals]);

  return {
    meals,
    loading: useSupabase().loading,
    error: useSupabase().error,
    fetchMeals,
    addMeal,
    updateMeal,
    deleteMeal
  };
};