// src/app/api/slots/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dateUtils } from '@/lib/utils';

// GET /api/slots - Get all slots for a household within a date range
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const householdId = searchParams.get('household_id');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  if (!householdId) {
    return Response.json({ error: 'Missing household_id parameter' }, { status: 400 });
  }

  // Validate date range if provided
  if (startDate) {
    const startValidation = dateUtils.validateDateRange(startDate);
    if (!startValidation.isValid) {
      return Response.json({ error: startValidation.error }, { status: 400 });
    }
  }
  
  if (endDate) {
    const endValidation = dateUtils.validateDateRange(endDate);
    if (!endValidation.isValid) {
      return Response.json({ error: endValidation.error }, { status: 400 });
    }
  }

  try {
    const supabase = createClient();
    
    // Check if user belongs to the household
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', householdId)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    // Build query with optional date range
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
    } else if (startDate) {
      // If only start date provided, get a week's worth of slots
      const weekEndDate = dateUtils.addDays(new Date(startDate), 6);
      query = query.gte('date', startDate).lte('date', dateUtils.formatDate(weekEndDate));
    }
    
    const { data: slots, error } = await query;
      
    if (error) throw error;
    
    return Response.json({ success: true, data: slots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch slots' 
    }, { status: 500 });
  }
}

// POST /api/slots - Create a new slot
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
    const { household_id, date, slot_type, is_active, meal_id } = body;
    
    // Validate required fields
    if (!household_id || !date || !slot_type) {
      return Response.json({ error: 'Missing required fields: household_id, date, slot_type' }, { status: 400 });
    }
    
    // Validate date
    const dateValidation = dateUtils.validateDateRange(date);
    if (!dateValidation.isValid) {
      return Response.json({ error: dateValidation.error }, { status: 400 });
    }
    
    // Validate slot type
    if (!['lunch', 'dinner'].includes(slot_type)) {
      return Response.json({ error: 'Invalid slot_type. Must be "lunch" or "dinner"' }, { status: 400 });
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
    
    // If meal_id is provided, check if the meal belongs to the same household
    if (meal_id) {
      const { data: meal, error: mealError } = await supabase
        .from('meals')
        .select('id, household_id')
        .eq('id', meal_id)
        .single();
      
      if (mealError || !meal) {
        return Response.json({ error: 'Meal not found' }, { status: 404 });
      }
      
      if (meal.household_id !== household_id) {
        return Response.json({ error: 'Meal does not belong to this household' }, { status: 403 });
      }
    }
    
    // Insert new slot
    const { data: slot, error: insertError } = await supabase
      .from('slots')
      .insert([{
        household_id,
        date,
        slot_type,
        is_active: is_active !== undefined ? is_active : true,
        meal_id: meal_id || null
      }])
      .select()
      .single();
      
    if (insertError) throw insertError;
    
    return Response.json({ success: true, data: slot });
  } catch (error) {
    console.error('Error creating slot:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to create slot' 
    }, { status: 500 });
  }
}