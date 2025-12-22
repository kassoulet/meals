// src/app/api/slots/shuffle/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dateUtils, shuffleUtils } from '@/lib/utils';

// POST /api/slots/shuffle - Shuffle empty active slots with random meals
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    const { household_id, start_date, end_date } = body;
    
    // Validate required fields
    if (!household_id || !start_date || !end_date) {
      return Response.json({ error: 'Missing required fields: household_id, start_date, end_date' }, { status: 400 });
    }
    
    // Validate dates
    const startValidation = dateUtils.validateDateRange(start_date);
    if (!startValidation.isValid) {
      return Response.json({ error: startValidation.error }, { status: 400 });
    }
    
    const endValidation = dateUtils.validateDateRange(end_date);
    if (!endValidation.isValid) {
      return Response.json({ error: endValidation.error }, { status: 400 });
    }
    
    // Check if user belongs to the household
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', household_id)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    // Get all meals for the household
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .eq('household_id', household_id);
      
    if (mealsError) throw mealsError;
    
    // If no meals, return error
    if (!meals || meals.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'No meals available to assign',
        updated_slots: [],
        duplicate_count: 0
      });
    }
    
    // Get all slots for the household within the date range
    const { data: slots, error: slotsError } = await supabase
      .from('slots')
      .select('*')
      .eq('household_id', household_id)
      .gte('date', start_date)
      .lte('date', end_date);
      
    if (slotsError) throw slotsError;
    
    // Find empty active slots (is_active = true and meal_id = null)
    const emptyActiveSlots = slots.filter(slot => slot.is_active && slot.meal_id === null);
    
    // If no empty slots, return early
    if (!emptyActiveSlots || emptyActiveSlots.length === 0) {
      return Response.json({ 
        success: true, 
        updated_slots: [],
        duplicate_count: 0
      });
    }
    
    // Use the shuffle utility to assign meals to slots
    const { updatedSlots, duplicateCount } = shuffleUtils.shuffleMealsForSlots(meals, slots);
    
    // Extract the updated empty slots for the response
    const updatedEmptySlots = updatedSlots.filter(slot => 
      emptyActiveSlots.some(emptySlot => emptySlot.id === slot.id)
    );
    
    // Update the slots in the database
    const updates = emptyActiveSlots.map(slot => ({
      id: slot.id,
      updates: { meal_id: updatedSlots.find(s => s.id === slot.id)?.meal_id }
    }));

    if (updates.length > 0) {
      // Update slots individually since we can't call our batch-update endpoint from server-side
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('slots')
          .update({ meal_id: update.updates.meal_id, updated_at: new Date().toISOString() })
          .eq('id', update.id);

        if (updateError) throw updateError;
      }
    }
    
    return Response.json({ 
      success: true, 
      updated_slots: updatedEmptySlots,
      duplicate_count: duplicateCount
    });
  } catch (error) {
    console.error('Error shuffling slots:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to shuffle slots' 
    }, { status: 500 });
  }
}