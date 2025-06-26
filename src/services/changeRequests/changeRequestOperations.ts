
import { supabase } from '@/integrations/supabase/client';
import type { CreateChangeRequestData, ListingChangeRequest } from '@/types/changeRequests';

export const createChangeRequestOperation = async (
  requestData: CreateChangeRequestData,
  userId: string
) => {
  console.log('🔄 Creating change request...', requestData);
  
  const { data, error } = await supabase
    .from('listing_change_requests')
    .insert({
      ...requestData,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Create change request error:', error);
    throw error;
  }
  
  console.log('✅ Change request created successfully:', data.id);
  return data;
};

export const fetchChangeRequestsOperation = async (isAdmin: boolean, userId?: string) => {
  console.log('📊 Fetching change requests...', { isAdmin });

  let query = supabase
    .from('listing_change_requests')
    .select(`
      *,
      sbir_listings (
        title,
        agency
      )
    `)
    .order('created_at', { ascending: false });

  // If not admin, only fetch user's own requests
  if (!isAdmin && userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error fetching change requests:', error);
    throw error;
  }

  console.log('✅ Change requests fetched successfully:', data.length);
  return data as ListingChangeRequest[];
};

export const updateChangeRequestStatusOperation = async (
  requestId: string,
  status: 'approved' | 'rejected',
  userId: string,
  adminNotes?: string
) => {
  console.log('🔄 Updating change request status...', { requestId, status });
  
  // First, get the change request details
  const { data: changeRequest, error: fetchError } = await supabase
    .from('listing_change_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchError) {
    console.error('❌ Error fetching change request:', fetchError);
    throw fetchError;
  }

  if (!changeRequest) {
    throw new Error('Change request not found');
  }

  // Update the change request status
  const { error: updateError } = await supabase
    .from('listing_change_requests')
    .update({
      status,
      admin_notes: adminNotes,
      processed_by: userId,
      processed_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (updateError) {
    console.error('❌ Update change request status error:', updateError);
    throw updateError;
  }

  return changeRequest;
};
