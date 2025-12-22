// src/app/api/households/[id]/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/households/[id] - Get a specific household
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const householdId = params.id;

  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is a member of the household
    const { data: memberCheck, error: memberError } = await supabase
      .from('household_members')
      .select('id')
      .eq('household_id', householdId)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !memberCheck) {
      return Response.json({ error: 'Not a member of this household' }, { status: 403 });
    }
    
    // Get the household
    const { data: household, error: householdError } = await supabase
      .from('households')
      .select('*')
      .eq('id', householdId)
      .single();
      
    if (householdError) throw householdError;
    
    return Response.json({ success: true, data: household });
  } catch (error) {
    console.error('Error fetching household:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch household' 
    }, { status: 500 });
  }
}

// PUT /api/households/[id] - Update a household
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const householdId = params.id;

  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is an admin of the household
    const { data: member, error: memberError } = await supabase
      .from('household_members')
      .select('role')
      .eq('household_id', householdId)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !member || member.role !== 'admin') {
      return Response.json({ error: 'Must be an admin to update household' }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return Response.json({ error: 'No updates provided' }, { status: 400 });
    }
    
    // Update the household
    const { data: updatedHousehold, error: updateError } = await supabase
      .from('households')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', householdId)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    return Response.json({ success: true, data: updatedHousehold });
  } catch (error) {
    console.error('Error updating household:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to update household' 
    }, { status: 500 });
  }
}

// DELETE /api/households/[id] - Delete a household
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const householdId = params.id;

  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is an admin of the household
    const { data: member, error: memberError } = await supabase
      .from('household_members')
      .select('role')
      .eq('household_id', householdId)
      .eq('user_id', user.id)
      .single();
      
    if (memberError || !member || member.role !== 'admin') {
      return Response.json({ error: 'Must be an admin to delete household' }, { status: 403 });
    }
    
    // Delete the household (and cascade delete related records due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from('households')
      .delete()
      .eq('id', householdId);
      
    if (deleteError) throw deleteError;
    
    return Response.json({ success: true, message: 'Household deleted successfully' });
  } catch (error) {
    console.error('Error deleting household:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete household' 
    }, { status: 500 });
  }
}