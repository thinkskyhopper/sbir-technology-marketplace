
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { ParsedListing } from "./types";
import type { ListingStatus } from "@/types/listings";

interface UploadResult {
  successCount: number;
  failureCount: number;
  failedListings: Array<{ listing: ParsedListing; error: string }>;
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
    const failedListings: Array<{ listing: ParsedListing; error: string }> = [];

    // Helper function to format date fields properly
    const formatDateField = (dateStr?: string): string | null => {
      if (!dateStr || dateStr.trim() === '' || dateStr === ',') {
        return null;
      }
      
      // Try to parse the date to validate it
      try {
        const date = new Date(dateStr.trim());
        if (isNaN(date.getTime())) {
          return null;
        }
        return dateStr.trim();
      } catch {
        return null;
      }
    };

    try {
      console.log('🔄 Starting bulk CSV upload...', { count: listings.length, fileName });

      // Process listings in smaller batches with retry logic
      const batchSize = 5; // Reduced batch size for better error tracking
      for (let i = 0; i < listings.length; i += batchSize) {
        const batch = listings.slice(i, i + batchSize);
        console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(listings.length/batchSize)} (rows ${i + 1}-${Math.min(i + batchSize, listings.length)})`);
        
        const batchData = batch.map(listing => ({
          title: listing.title,
          description: listing.description,
          agency: listing.agency,
          phase: listing.phase,
          value: Math.round(listing.value * 100), // Convert to cents
          deadline: formatDateField(listing.deadline),
          category: listing.category,
          photo_url: listing.photo_url || null,
          status: 'Pending' as ListingStatus,
          user_id: user.id,
          // Optional fields - only include if present and properly formatted
          technology_summary: listing.technology_summary?.trim() || null,
          internal_title: listing.internal_title?.trim() || null,
          internal_description: listing.internal_description?.trim() || null,
          agency_tracking_number: listing.agency_tracking_number?.trim() || null,
          contract: listing.contract?.trim() || null,
          proposal_award_date: formatDateField(listing.proposal_award_date),
          contract_end_date: formatDateField(listing.contract_end_date),
          topic_code: listing.topic_code?.trim() || null,
          company: listing.company?.trim() || null,
          address: listing.address?.trim() || null,
          primary_investigator_name: listing.primary_investigator_name?.trim() || null,
          pi_phone: listing.pi_phone?.trim() || null,
          pi_email: listing.pi_email?.trim() || null,
          business_contact_name: listing.business_contact_name?.trim() || null,
          bc_phone: listing.bc_phone?.trim() || null,
          bc_email: listing.bc_email?.trim() || null,
        }));

        let retryCount = 0;
        const maxRetries = 2;
        let batchSuccess = false;

        while (retryCount <= maxRetries && !batchSuccess) {
          try {
            const { data, error } = await supabase
              .from('sbir_listings')
              .insert(batchData)
              .select('id');

            if (error) {
              console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} upload error (attempt ${retryCount + 1}):`, {
                error: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                batchRowNumbers: batch.map(l => l.rowNumber)
              });
              
              if (retryCount === maxRetries) {
                // Final attempt failed - try individual inserts to identify specific failures
                console.log(`🔍 Attempting individual inserts for batch ${Math.floor(i/batchSize) + 1}...`);
                for (let j = 0; j < batch.length; j++) {
                  try {
                    const { error: individualError } = await supabase
                      .from('sbir_listings')
                      .insert([batchData[j]])
                      .select('id');
                    
                    if (individualError) {
                      console.error(`❌ Individual insert failed for row ${batch[j].rowNumber}:`, individualError);
                      failedListings.push({
                        listing: batch[j],
                        error: `Row ${batch[j].rowNumber}: ${individualError.message}`
                      });
                      failureCount++;
                    } else {
                      console.log(`✅ Individual insert succeeded for row ${batch[j].rowNumber}`);
                      successCount++;
                    }
                  } catch (individualErr) {
                    console.error(`❌ Individual insert exception for row ${batch[j].rowNumber}:`, individualErr);
                    failedListings.push({
                      listing: batch[j],
                      error: `Row ${batch[j].rowNumber}: ${individualErr instanceof Error ? individualErr.message : 'Unknown error'}`
                    });
                    failureCount++;
                  }
                }
                batchSuccess = true; // Exit retry loop since we handled individual inserts
              } else {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
              }
            } else {
              console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} uploaded successfully:`, data?.length, 'records');
              successCount += batch.length;
              batchSuccess = true;
            }
          } catch (batchErr) {
            console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} exception (attempt ${retryCount + 1}):`, batchErr);
            if (retryCount === maxRetries) {
              // Track all listings in this batch as failed
              batch.forEach(listing => {
                failedListings.push({
                  listing,
                  error: `Row ${listing.rowNumber}: ${batchErr instanceof Error ? batchErr.message : 'Unknown error'}`
                });
              });
              failureCount += batch.length;
              batchSuccess = true;
            } else {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
          }
        }
      }

      // Log detailed results
      console.log('📊 CSV upload completed:', { successCount, failureCount });
      if (failedListings.length > 0) {
        console.log('❌ Failed listings details:', failedListings);
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
      return { successCount, failureCount, failedListings };
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
