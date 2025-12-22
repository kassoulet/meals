// src/hooks/useHouseholds.ts
import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { Household } from '@/types';

export const useHouseholds = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const { executeWithState, supabase } = useSupabase();

  const fetchHouseholds = useCallback(async () => {
    const result = await executeWithState(async () => {
      const { data, error } = await supabase
        .from('household_members')
        .select(`
          household_id,
          role,
          households (
            id,
            name,
            created_at,
            updated_at,
            max_members
          )
        `);

      if (error) throw error;
      // Extract households from the joined query result
      return data.map(item => item.households) as unknown as Household[];
    });

    if (result) {
      setHouseholds(result);
    }
  }, [executeWithState, supabase]);

  const addHousehold = useCallback(async (household: Omit<Household, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await executeWithState(async () => {
      // First create the household
      const { data: newHousehold, error: householdError } = await supabase
        .from('households')
        .insert([household])
        .select()
        .single();

      if (householdError) throw householdError;

      // Then add the current user as a member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert([{
          household_id: newHousehold.id,
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          role: 'admin'
        }]);

      if (memberError) throw memberError;

      return newHousehold as Household;
    });

    if (result) {
      setHouseholds(prev => [...prev, result]);
      return result;
    }
    return null;
  }, [executeWithState, supabase]);

  const updateHousehold = useCallback(async (id: string, updates: Partial<Household>) => {
    const result = await executeWithState(async () => {
      const { data, error } = await supabase
        .from('households')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Household;
    });

    if (result) {
      setHouseholds(prev => prev.map(h => h.id === id ? result : h));
      return result;
    }
    return null;
  }, [executeWithState, supabase]);

  const deleteHousehold = useCallback(async (id: string) => {
    const result = await executeWithState(async () => {
      const { error } = await supabase
        .from('households')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    });

    if (result?.success) {
      setHouseholds(prev => prev.filter(h => h.id !== id));
      return true;
    }
    return false;
  }, [executeWithState, supabase]);

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  return {
    households,
    loading: useSupabase().loading,
    error: useSupabase().error,
    fetchHouseholds,
    addHousehold,
    updateHousehold,
    deleteHousehold
  };
};