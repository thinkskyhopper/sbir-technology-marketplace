
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  createChangeRequestOperation, 
  fetchChangeRequestsOperation, 
  updateChangeRequestStatusOperation 
} from '@/services/changeRequests/changeRequestOperations';
import { handleApprovedDeletion, handleApprovedChanges } from '@/services/changeRequests/listingUpdateOperations';
import { sendChangeRequestNotification } from '@/services/changeRequests/notificationService';
import type { CreateChangeRequestData, ListingChangeRequest } from '@/types/changeRequests';

export const useChangeRequestOperations = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createChangeRequest = async (requestData: CreateChangeRequestData) => {
    if (!user) {
      throw new Error('Must be authenticated to create change requests');
    }

    try {
      setLoading(true);
      const data = await createChangeRequestOperation(requestData, user.id);
      
      // Send notification to admins
      await sendChangeRequestNotification(
        data,
        user.user_metadata?.full_name || 'Unknown User',
        user.email || ''
      );
      
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
      return await fetchChangeRequestsOperation(isAdmin, user?.id);
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
      const changeRequest = await updateChangeRequestStatusOperation(
        requestId, 
        status, 
        user.id, 
        adminNotes
      );

      // Handle approved requests
      if (status === 'approved') {
        if (changeRequest.request_type === 'deletion') {
          await handleApprovedDeletion(changeRequest);
        } else if (changeRequest.request_type === 'change') {
          await handleApprovedChanges(changeRequest);
        }
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
