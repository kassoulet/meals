// src/app/api/slots/batch-update/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PUT /api/slots/batch-update - Update multiple slots at once
export async function PUT(request: NextRequest) {
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
    const { updates } = body; // Array of {id: string, updates: Partial<Slot>}
    
    if (!updates || !Array.isArray(updates)) {
      return Response.json({ error: 'Invalid request body: updates array required' }, { status: 400 });
    }
    
    // Validate each update
    for (const update of updates) {
      if (!update.id || !update.updates) {
        return Response.json({ error: 'Each update must have an id and updates object' }, { status: 400 });
      }
    }
    
    // Process updates in a transaction-like manner
    const results = [];
    for (const update of updates) {
      // Get the slot to check household
      const { data: slot, error: fetchError } = await supabase
        .from('slots')
        .select('household_id')
        .eq('id', update.id)
        .single();
        
      if (fetchError) {
        return Response.json({ error: `Error fetching slot ${update.id}: ${fetchError.message}` }, { status: 500 });
      }
      
      // Check if user belongs to the slot's household
      const { data: memberCheck, error: memberError } = await supabase
        .from('household_members')
        .select('id')
        .eq('household_id', slot.household_id)
        .eq('user_id', user.id)
        .single();
        
      if (memberError || !memberCheck) {
        return Response.json({ error: `Not a member of household for slot ${update.id}` }, { status: 403 });
      }
      
      // If meal_id is being updated, validate that the meal belongs to the same household
      if (update.updates.meal_id !== undefined) {
        if (update.updates.meal_id) {
          const { data: meal, error: mealError } = await supabase
            .from('meals')
            .select('id, household_id')
            .eq('id', update.updates.meal_id)
            .single();
          
          if (mealError || !meal) {
            return Response.json({ error: `Meal not found for slot ${update.id}` }, { status: 404 });
          }
          
          if (meal.household_id !== slot.household_id) {
            return Response.json({ error: `Meal does not belong to household for slot ${update.id}` }, { status: 403 });
          }
        }
      }
      
      // Apply the update
      const { data: updatedSlot, error: updateError } = await supabase
        .from('slots')
        .update({ ...update.updates, updated_at: new Date().toISOString() })
        .eq('id', update.id)
        .select()
        .single();
        
      if (updateError) {
        return Response.json({ error: `Error updating slot ${update.id}: ${updateError.message}` }, { status: 500 });
      }
      
      results.push(updatedSlot);
    }
    
    return Response.json({ 
      success: true, 
      data: results,
      updated_count: results.length
    });
  } catch (error) {
    console.error('Error batch updating slots:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to batch update slots' 
    }, { status: 500 });
  }
}