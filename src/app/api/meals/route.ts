// src/app/api/meals/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MealFormValues } from '@/types';
import { validationUtils } from '@/lib/validations';

// GET /api/meals - Get all meals for a household
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const householdId = searchParams.get('household_id');

  if (!householdId) {
    return Response.json({ error: 'Missing household_id parameter' }, { status: 400 });
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
    
    // Get meals for the household
    const { data: meals, error } = await supabase
      .from('meals')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return Response.json({ success: true, data: meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch meals' 
    }, { status: 500 });
  }
}

// POST /api/meals - Create a new meal
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
    const { household_id, name, description } = body;
    
    // Validate input
    if (!household_id || !name) {
      return Response.json({ error: 'Missing required fields: household_id, name' }, { status: 400 });
    }
    
    const nameValidation = validationUtils.validateMealName(name);
    if (!nameValidation.isValid) {
      return Response.json({ error: nameValidation.error }, { status: 400 });
    }
    
    const descriptionValidation = validationUtils.validateMealDescription(description);
    if (!descriptionValidation.isValid) {
      return Response.json({ error: descriptionValidation.error }, { status: 400 });
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
    
    // Insert new meal
    const { data: meal, error: insertError } = await supabase
      .from('meals')
      .insert([{ 
        household_id, 
        name, 
        description: description || null 
      }])
      .select()
      .single();
      
    if (insertError) throw insertError;
    
    return Response.json({ success: true, data: meal });
  } catch (error) {
    console.error('Error creating meal:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to create meal' 
    }, { status: 500 });
  }
}