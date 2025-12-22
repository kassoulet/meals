// src/app/api/households/join/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/households/join - Join a household with a code
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
    const { code } = body; // In a real implementation, this would be an invite code
    
    if (!code) {
      return Response.json({ error: 'Missing required field: code' }, { status: 400 });
    }
    
    // In a real implementation, we would validate the invite code
    // For now, we'll simulate joining a household by ID
    // In practice, the code would map to a household_id via an invites table
    const householdId = code; // This is a simplified approach
    
    // Check if household exists
    const { data: household, error: householdError } = await supabase
      .from('households')
      .select('*')
      .eq('id', householdId)
      .single();
      
    if (householdError || !household) {
      return Response.json({ error: 'Household not found' }, { status: 404 });
    }
    
    // Check if user is already a member
    const { data: existingMembership, error: existingError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', householdId)
      .eq('user_id', user.id)
      .single();
      
    if (existingMembership) {
      return Response.json({ error: 'Already a member of this household' }, { status: 400 });
    }
    
    // Add user as a member
    const { error: memberError } = await supabase
      .from('household_members')
      .insert([{
        household_id: householdId,
        user_id: user.id,
        role: 'member'
      }]);
      
    if (memberError) throw memberError;
    
    return Response.json({ 
      success: true, 
      message: 'Successfully joined household',
      household
    });
  } catch (error) {
    console.error('Error joining household:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to join household' 
    }, { status: 500 });
  }
}