// src/app/api/meals/[id]/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validationUtils } from '@/lib/validations';

// GET /api/meals/[id] - Get a specific meal
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const mealId = params.id;

  try {
    const supabase = createClient();
    
    // Get the meal
    const { data: meal, error } = await supabase
      .from('meals')
      .select(`
        *,
        household:households(id, name)
      `)
      .eq('id', mealId)
      .single();
      
    if (error) throw error;
    
    // Check if user belongs to the meal's household
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', meal.household_id)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    return Response.json({ success: true, data: meal });
  } catch (error) {
    console.error('Error fetching meal:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch meal' 
    }, { status: 500 });
  }
}

// PUT /api/meals/[id] - Update a meal
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const mealId = params.id;

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
    const { name, description } = body;
    
    // Validate input if provided
    if (name) {
      const nameValidation = validationUtils.validateMealName(name);
      if (!nameValidation.isValid) {
        return Response.json({ error: nameValidation.error }, { status: 400 });
      }
    }
    
    if (description !== undefined) {
      const descriptionValidation = validationUtils.validateMealDescription(description);
      if (!descriptionValidation.isValid) {
        return Response.json({ error: descriptionValidation.error }, { status: 400 });
      }
    }
    
    // Get the meal to check household
    const { data: meal, error: fetchError } = await supabase
      .from('meals')
      .select('household_id')
      .eq('id', mealId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Check if user belongs to the meal's household
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', meal.household_id)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    // Update the meal
    const updates: any = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    updates.updated_at = new Date().toISOString();
    
    const { data: updatedMeal, error: updateError } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', mealId)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    return Response.json({ success: true, data: updatedMeal });
  } catch (error) {
    console.error('Error updating meal:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to update meal' 
    }, { status: 500 });
  }
}

// DELETE /api/meals/[id] - Delete a meal
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const mealId = params.id;

  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the meal to check household
    const { data: meal, error: fetchError } = await supabase
      .from('meals')
      .select('household_id')
      .eq('id', mealId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Check if user belongs to the meal's household
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', meal.household_id)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    // Delete the meal
    const { error: deleteError } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);
      
    if (deleteError) throw deleteError;
    
    return Response.json({ success: true, message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete meal' 
    }, { status: 500 });
  }
}