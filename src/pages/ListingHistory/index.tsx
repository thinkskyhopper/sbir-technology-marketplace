
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditListingDialog from "@/components/EditListingDialog";
import { supabase } from "@/integrations/supabase/client";
import type { SBIRListing } from "@/types/listings";
import { listingsService } from "@/services/listings";
import { ListingHistoryHeader } from "./components/ListingHistoryHeader";
import { ListingDetailsSection } from "./components/ListingDetailsSection";
import { AuditLogsSection } from "./components/AuditLogsSection";

interface AuditLog {
  id: string;
  action_type: string;
  created_at: string;
  user_notes?: string;
  internal_notes?: string;
  changes_made?: any;
  admin_profile?: {
    full_name: string;
    email: string;
  };
}

const ListingHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: listing, isLoading: listingLoading, refetch: refetchListing } = useQuery({
    queryKey: ['listing-history', id],
    queryFn: async () => {
      const listings = await listingsService.fetchListings(isAdmin);
      // Find listing by either UUID or public_id (for short URLs)
      const targetListing = listings.find(listing => listing.id === id || listing.public_id === id);
      if (!targetListing) {
        throw new Error('Listing not found');
      }
      return targetListing;
    },
    enabled: !!id && isAdmin,
  });

  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['listing-audit-logs', listing?.id],
    queryFn: async () => {
      if (!listing?.id) return [];
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select(`
          *,
          profiles!admin_audit_logs_admin_id_fkey (
            full_name,
            email
          )
        `)
        .eq('listing_id', listing.id) // Always use UUID for DB queries
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(log => ({
        ...log,
        admin_profile: log.profiles
      })) as AuditLog[];
    },
    enabled: !!listing?.id && isAdmin,
  });

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  if (listingLoading || logsLoading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    refetchListing();
  };

  const handleViewListing = () => {
    // Use public_id for URLs when available
    navigate(`/listing/${listing?.public_id || id}`);
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          <ListingHistoryHeader 
            onBack={() => navigate('/admin/listings')}
            onEdit={() => setShowEditDialog(true)}
            onViewListing={handleViewListing}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListingDetailsSection listing={listing} />
            <AuditLogsSection auditLogs={auditLogs} />
          </div>
        </div>

        <Footer />

        <EditListingDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) {
              handleEditSuccess();
            }
          }}
          listing={listing}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ListingHistory;
