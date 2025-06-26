
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CreateChangeRequestData, ListingChangeRequest } from '@/types/changeRequests';
import { useAuth } from '@/contexts/AuthContext';

export const useChangeRequests = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createChangeRequest = async (requestData: CreateChangeRequestData) => {
    if (!user) {
      throw new Error('Must be authenticated to create change requests');
    }

    try {
      setLoading(true);
      console.log('🔄 Creating change request...', requestData);
      
      const { data, error } = await supabase
        .from('listing_change_requests')
        .insert({
          ...requestData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Create change request error:', error);
        throw error;
      }
      
      console.log('✅ Change request created successfully:', data.id);
      
      // Send notification to admins
      try {
        const { error: notificationError } = await supabase.functions.invoke('send-change-request-notification', {
          body: {
            changeRequest: data,
            submitterName: user.user_metadata?.full_name || 'Unknown User',
            submitterEmail: user.email
          }
        });

        if (notificationError) {
          console.warn('⚠️ Change request notification failed (request still created):', notificationError);
        } else {
          console.log('✅ Change request notification sent successfully');
        }
      } catch (notificationError) {
        console.warn('⚠️ Change request notification failed (request still created):', notificationError);
      }
      
      return data;
    } catch (err) {
      console.error('❌ Error creating change request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchChangeRequests = async (isAdmin = false) => {
    try {
      setLoading(true);
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
      if (!isAdmin && user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching change requests:', error);
        throw error;
      }

      console.log('✅ Change requests fetched successfully:', data.length);
      return data as ListingChangeRequest[];
    } catch (err) {
      console.error('❌ Error fetching change requests:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateChangeRequestStatus = async (
    requestId: string, 
    status: 'approved' | 'rejected', 
    adminNotes?: string
  ) => {
    if (!user) {
      throw new Error('Must be authenticated to update change requests');
    }

    try {
      setLoading(true);
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
          processed_by: user.id,
          processed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('❌ Update change request status error:', updateError);
        throw updateError;
      }

      // If approved and it's a change request (not deletion), apply the changes to the listing
      if (status === 'approved' && changeRequest.request_type === 'change' && changeRequest.requested_changes) {
        console.log('🔄 Applying approved changes to listing...', changeRequest.listing_id);
        
        // Prepare the update data, converting value to cents if present
        const updateData = { ...changeRequest.requested_changes };
        if (updateData.value && typeof updateData.value === 'number') {
          updateData.value = Math.round(updateData.value * 100); // Convert dollars to cents
        }

        const { error: listingUpdateError } = await supabase
          .from('sbir_listings')
          .update(updateData)
          .eq('id', changeRequest.listing_id);

        if (listingUpdateError) {
          console.error('❌ Error updating listing with approved changes:', listingUpdateError);
          throw new Error(`Failed to apply changes to listing: ${listingUpdateError.message}`);
        }

        console.log('✅ Successfully applied approved changes to listing');
      }
      
      console.log('✅ Change request status updated successfully');
    } catch (err) {
      console.error('❌ Error updating change request status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createChangeRequest,
    fetchChangeRequests,
    updateChangeRequestStatus,
    loading
  };
};
