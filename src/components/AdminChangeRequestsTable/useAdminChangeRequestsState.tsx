
import { useState, useEffect } from "react";
import { useChangeRequests } from "@/hooks/useChangeRequests";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ListingChangeRequest } from "@/types/changeRequests";
import type { AdminProfile } from "./types";

export const useAdminChangeRequestsState = () => {
  const [changeRequests, setChangeRequests] = useState<ListingChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ListingChangeRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [adminNotesForUser, setAdminNotesForUser] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminProfiles, setAdminProfiles] = useState<{ [key: string]: AdminProfile }>({});
  
  const { fetchChangeRequests, updateChangeRequestStatus } = useChangeRequests();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const loadChangeRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch change requests with user profile information
      const { data: requests, error: requestsError } = await supabase
        .from('listing_change_requests')
        .select(`
          *,
          profiles!listing_change_requests_user_id_fkey (
            full_name,
            email
          ),
          sbir_listings (
            title,
            agency
          )
        `)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching change requests:', requestsError);
        throw requestsError;
      }

      setChangeRequests(requests || []);
      
      // Get unique admin IDs who have processed requests
      const adminIds = [...new Set(requests?.map(r => r.processed_by).filter(Boolean) || [])];
      
      // Fetch admin profiles for processed requests
      if (adminIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', adminIds);
        
        if (profiles) {
          const profilesMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as { [key: string]: AdminProfile });
          setAdminProfiles(profilesMap);
        }
      }
    } catch (err) {
      console.error('Failed to load change requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load change requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadChangeRequests();
    }
  }, [isAdmin]);

  const handleViewDetails = (request: ListingChangeRequest) => {
    setSelectedRequest(request);
    setAdminNotes("");
    setAdminNotesForUser("");
    setShowDetailsDialog(true);
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await updateChangeRequestStatus(requestId, 'approved', adminNotes, adminNotesForUser);
      toast({
        title: "Request Approved",
        description: "The change request has been approved successfully.",
      });
      await loadChangeRequests();
      setShowDetailsDialog(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await updateChangeRequestStatus(requestId, 'rejected', adminNotes, adminNotesForUser);
      toast({
        title: "Request Rejected",
        description: "The change request has been rejected.",
      });
      await loadChangeRequests();
      setShowDetailsDialog(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getAdminInfo = (adminId: string) => {
    const admin = adminProfiles[adminId];
    return admin ? `${admin.full_name || admin.email}` : 'Unknown Admin';
  };

  return {
    changeRequests,
    loading,
    error,
    selectedRequest,
    showDetailsDialog,
    setShowDetailsDialog,
    adminNotes,
    setAdminNotes,
    adminNotesForUser,
    setAdminNotesForUser,
    processingId,
    adminProfiles,
    handleViewDetails,
    handleApprove,
    handleReject,
    getAdminInfo
  };
};
