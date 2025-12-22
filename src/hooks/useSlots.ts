// src/hooks/useSlots.ts
import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { Slot } from '@/types';
import { optimisticUpdateUtils } from '@/lib/utils/optimistic-updates';

export const useSlots = (householdId?: string, startDate?: string, endDate?: string) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const { executeWithState, supabase } = useSupabase();

  const fetchSlots = useCallback(async () => {
    if (!householdId) return;

    const result = await executeWithState(async () => {
      let query = supabase
        .from('slots')
        .select(`
          *,
          meal:meals(id, name, description)
        `)
        .eq('household_id', householdId)
        .order('date', { ascending: true });

      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (Slot & { meal: any | null })[];
    });

    if (result) {
      setSlots(result);
    }
  }, [executeWithState, householdId, startDate, endDate, supabase]);

  const addSlot = useCallback(async (slot: Omit<Slot, 'id' | 'created_at' | 'updated_at'>) => {
    // Optimistically add the slot
    const optimisticSlot = {
      ...slot,
      id: `optimistic-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Slot;

    setSlots(prev => [...prev, optimisticSlot]);

    try {
      const result = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('slots')
          .insert([slot])
          .select()
          .single();

        if (error) throw error;
        return data as Slot;
      });

      if (result) {
        // Replace the optimistic slot with the actual one
        setSlots(prev => prev.map(s =>
          s.id === optimisticSlot.id ? result : s
        ));
        return result;
      }
      return null;
    } catch (error) {
      // If the API call fails, remove the optimistic slot
      setSlots(prev => prev.filter(s => s.id !== optimisticSlot.id));
      throw error;
    }
  }, [executeWithState, supabase]);

  const updateSlot = useCallback(async (id: string, updates: Partial<Slot>) => {
    // Optimistically update the slot
    setSlots(prev => optimisticUpdateUtils.slots.updateSlot(prev, id, updates));

    try {
      const result = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('slots')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Slot;
      });

      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      // If the API call fails, revert the optimistic update
      const originalSlot = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('slots')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as Slot;
      });

      if (originalSlot) {
        setSlots(prev =>
          prev.map(s => s.id === id ? originalSlot : s)
        );
      }
      throw error;
    }
  }, [executeWithState, supabase]);

  const batchUpdateSlots = useCallback(async (updates: { id: string; updates: Partial<Slot> }[]) => {
    // Optimistically update the slots
    setSlots(prev => optimisticUpdateUtils.slots.batchUpdateSlots(prev, updates));

    try {
      // Process updates individually since we can't do bulk updates with Supabase
      const results = [];
      for (const update of updates) {
        const result = await executeWithState(async () => {
          const { data, error } = await supabase
            .from('slots')
            .update({ ...update.updates, updated_at: new Date().toISOString() })
            .eq('id', update.id)
            .select()
            .single();

          if (error) throw error;
          return data as Slot;
        });

        if (result) {
          results.push(result);
        }
      }

      return results;
    } catch (error) {
      // If the API call fails, revert the optimistic updates
      if (startDate && endDate && householdId) {
        const originalSlots = await executeWithState(async () => {
          let query = supabase
            .from('slots')
            .select('*')
            .eq('household_id', householdId)
            .order('date', { ascending: true });

          if (startDate && endDate) {
            query = query.gte('date', startDate).lte('date', endDate);
          }

          const { data, error } = await query;

          if (error) throw error;
          return data as Slot[];
        });

        if (originalSlots) {
          setSlots(originalSlots);
        }
      }
      throw error;
    }
  }, [executeWithState, householdId, startDate, endDate, supabase]);

  const deleteSlot = useCallback(async (id: string) => {
    // Optimistically remove the slot
    setSlots(prev => optimisticUpdateUtils.slots.removeSlot(prev, id));

    try {
      const result = await executeWithState(async () => {
        const { error } = await supabase
          .from('slots')
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
      // If the API call fails, add the slot back
      const originalSlot = await executeWithState(async () => {
        const { data, error } = await supabase
          .from('slots')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as Slot;
      });

      if (originalSlot) {
        setSlots(prev => [...prev, originalSlot]);
      }
      throw error;
    }
  }, [executeWithState, supabase]);

  useEffect(() => {
    if (householdId) {
      fetchSlots();
    }
  }, [householdId, fetchSlots]);

  return {
    slots,
    loading: useSupabase().loading,
    error: useSupabase().error,
    fetchSlots,
    addSlot,
    updateSlot,
    batchUpdateSlots,
    deleteSlot
  };
};