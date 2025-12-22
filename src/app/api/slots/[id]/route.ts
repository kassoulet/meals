// src/app/api/slots/[id]/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dateUtils } from '@/lib/utils';

// GET /api/slots/[id] - Get a specific slot
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const slotId = params.id;

  try {
    const supabase = createClient();
    
    // Get the slot
    const { data: slot, error } = await supabase
      .from('slots')
      .select(`
        *,
        meal:meals(id, name, description)
      `)
      .eq('id', slotId)
      .single();
      
    if (error) throw error;
    
    // Check if user belongs to the slot's household
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', slot.household_id)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    return Response.json({ success: true, data: slot });
  } catch (error) {
    console.error('Error fetching slot:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch slot' 
    }, { status: 500 });
  }
}

// PUT /api/slots/[id] - Update a slot
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const slotId = params.id;

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
    const { date, slot_type, is_active, meal_id } = body;
    
    // Get the slot to check household
    const { data: slot, error: fetchError } = await supabase
      .from('slots')
      .select('household_id, meal_id')
      .eq('id', slotId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Check if user belongs to the slot's household
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', slot.household_id)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    // Build updates object
    const updates: any = {};
    if (date) {
      const dateValidation = dateUtils.validateDateRange(date);
      if (!dateValidation.isValid) {
        return Response.json({ error: dateValidation.error }, { status: 400 });
      }
      updates.date = date;
    }
    
    if (slot_type) {
      if (!['lunch', 'dinner'].includes(slot_type)) {
        return Response.json({ error: 'Invalid slot_type. Must be "lunch" or "dinner"' }, { status: 400 });
      }
      updates.slot_type = slot_type;
    }
    
    if (is_active !== undefined) {
      updates.is_active = is_active;
    }
    
    if (meal_id !== undefined) {
      if (meal_id) {
        // If meal_id is provided, check if the meal belongs to the same household
        const { data: meal, error: mealError } = await supabase
          .from('meals')
          .select('id, household_id')
          .eq('id', meal_id)
          .single();
        
        if (mealError || !meal) {
          return Response.json({ error: 'Meal not found' }, { status: 404 });
        }
        
        if (meal.household_id !== slot.household_id) {
          return Response.json({ error: 'Meal does not belong to this household' }, { status: 403 });
        }
      }
      updates.meal_id = meal_id || null;
    }
    
    updates.updated_at = new Date().toISOString();
    
    // Update the slot
    const { data: updatedSlot, error: updateError } = await supabase
      .from('slots')
      .update(updates)
      .eq('id', slotId)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    return Response.json({ success: true, data: updatedSlot });
  } catch (error) {
    console.error('Error updating slot:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to update slot' 
    }, { status: 500 });
  }
}

// DELETE /api/slots/[id] - Delete a slot
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const slotId = params.id;

  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the slot to check household
    const { data: slot, error: fetchError } = await supabase
      .from('slots')
      .select('household_id')
      .eq('id', slotId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Check if user belongs to the slot's household
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', slot.household_id)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    // Delete the slot
    const { error: deleteError } = await supabase
      .from('slots')
      .delete()
      .eq('id', slotId);
      
    if (deleteError) throw deleteError;
    
    return Response.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete slot' 
    }, { status: 500 });
  }
}