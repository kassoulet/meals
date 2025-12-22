// src/app/api/households/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validationUtils } from '@/lib/validations';

// GET /api/households - Get user's households
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get households the user belongs to
    const { data: householdMemberships, error: membershipError } = await supabase
      .from('household_members')
      .select(`
        household_id,
        role,
        created_at,
        households (
          id,
          name,
          created_at,
          updated_at,
          max_members
        )
      `)
      .eq('user_id', user.id);
      
    if (membershipError) throw membershipError;
    
    // Extract households from memberships
    const households = householdMemberships.map(hm => hm.households);
    
    return Response.json({ success: true, data: households });
  } catch (error) {
    console.error('Error fetching households:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch households' 
    }, { status: 500 });
  }
}

// POST /api/households - Create a new household
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
    const { name } = body;
    
    // Validate input
    if (!name) {
      return Response.json({ error: 'Missing required field: name' }, { status: 400 });
    }
    
    const nameValidation = validationUtils.validateHouseholdName(name);
    if (!nameValidation.isValid) {
      return Response.json({ error: nameValidation.error }, { status: 400 });
    }
    
    // Insert new household
    const { data: household, error: insertError } = await supabase
      .from('households')
      .insert([{ name }])
      .select()
      .single();
      
    if (insertError) throw insertError;
    
    // Add the user as a member of the household
    const { error: memberError } = await supabase
      .from('household_members')
      .insert([{
        household_id: household.id,
        user_id: user.id,
        role: 'admin' // Creator becomes admin
      }]);
      
    if (memberError) throw memberError;
    
    return Response.json({ success: true, data: household });
  } catch (error) {
    console.error('Error creating household:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to create household' 
    }, { status: 500 });
  }
}