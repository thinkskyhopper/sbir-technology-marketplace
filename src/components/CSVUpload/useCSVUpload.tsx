
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { ParsedListing } from "./types";
import type { ListingStatus } from "@/types/listings";

interface UploadResult {
  successCount: number;
  failureCount: number;
}

export const useCSVUpload = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const uploadListings = async (listings: ParsedListing[], fileName: string): Promise<UploadResult> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    let successCount = 0;
    let failureCount = 0;

    try {
      console.log('🔄 Starting bulk CSV upload...', { count: listings.length, fileName });

      // Process listings in batches to avoid overwhelming the database
      const batchSize = 10;
      for (let i = 0; i < listings.length; i += batchSize) {
        const batch = listings.slice(i, i + batchSize);
        
        const batchData = batch.map(listing => ({
          title: listing.title,
          description: listing.description,
          agency: listing.agency,
          phase: listing.phase,
          value: Math.round(listing.value * 100), // Convert to cents
          deadline: listing.deadline || null,
          category: listing.category,
          photo_url: listing.photo_url || null,
          status: 'Pending' as ListingStatus,
          user_id: user.id,
          // Optional fields - only include if present
          technology_summary: listing.technology_summary || null,
          agency_tracking_number: listing.agency_tracking_number || null,
          contract: listing.contract || null,
          proposal_award_date: listing.proposal_award_date || null,
          contract_end_date: listing.contract_end_date || null,
          topic_code: listing.topic_code || null,
          company: listing.company || null,
          address: listing.address || null,
          primary_investigator_name: listing.primary_investigator_name || null,
          pi_phone: listing.pi_phone || null,
          pi_email: listing.pi_email || null,
          business_contact_name: listing.business_contact_name || null,
          bc_phone: listing.bc_phone || null,
          bc_email: listing.bc_email || null,
        }));

        const { data, error } = await supabase
          .from('sbir_listings')
          .insert(batchData)
          .select('id');

        if (error) {
          console.error('❌ Batch upload error:', error);
          failureCount += batch.length;
        } else {
          console.log('✅ Batch uploaded successfully:', data?.length);
          successCount += batch.length;
        }
      }

      // Send admin notification if any listings were successfully uploaded
      if (successCount > 0) {
        try {
          console.log('🔔 Sending admin notification for CSV upload...');
          await sendBulkUploadNotification(successCount, fileName);
        } catch (notificationError) {
          console.error('❌ Failed to send admin notification:', notificationError);
          // Don't fail the whole operation if notification fails
        }
      }

      console.log('✅ CSV upload completed:', { successCount, failureCount });
      return { successCount, failureCount };
    } catch (error) {
      console.error('❌ CSV upload failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendBulkUploadNotification = async (listingCount: number, fileName: string) => {
    if (!user) return;

    // Get user profile for notification
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const response = await supabase.functions.invoke('send-csv-upload-notification', {
      body: {
        uploadDetails: {
          fileName,
          listingCount,
          uploadedBy: userProfile?.full_name || 'Unknown User',
          uploaderEmail: userProfile?.email || 'unknown@example.com'
        }
      }
    });

    if (response.error) {
      throw new Error(`Notification failed: ${response.error.message}`);
    }
  };

  return {
    uploadListings,
    loading
  };
};
