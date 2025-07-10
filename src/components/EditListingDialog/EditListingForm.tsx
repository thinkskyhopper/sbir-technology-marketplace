
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useListings } from "@/hooks/useListings";
import { useToast } from "@/hooks/use-toast";
import { listingSchema } from "../CreateListingDialog/listingSchema";
import ListingFormFields from "../CreateListingDialog/ListingFormFields";
import PhotoUpload from "../PhotoUpload";
import StatusField from "./StatusField";
import FormActions from "./FormActions";
import AdminOnlyFields from "./AdminOnlyFields";
import AdminNotesField from "./AdminNotesField";
import { z } from "zod";
import type { SBIRListing } from "@/types/listings";

// Extend the form schema to include status and admin-only fields
const editListingSchema = listingSchema.extend({
  status: z.enum(['Active', 'Pending', 'Sold', 'Rejected', 'Hidden']),
  agency_tracking_number: z.string().optional(),
  contract: z.string().optional(),
  proposal_award_date: z.string().optional(),
  contract_end_date: z.string().optional(),
  topic_code: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  primary_investigator_name: z.string().optional(),
  pi_phone: z.string().optional(),
  pi_email: z.string().optional(),
  business_contact_name: z.string().optional(),
  bc_phone: z.string().optional(),
  bc_email: z.string().optional(),
  admin_notes: z.string().optional(),
});

type EditListingFormData = z.infer<typeof editListingSchema>;

// Extend the form data to include photo_url, status, date_sold, and technology_summary
interface ExtendedEditListingFormData extends EditListingFormData {
  photo_url?: string;
  date_sold?: string | null;
  technology_summary?: string | null;
}

interface EditListingFormProps {
  listing: SBIRListing;
  onClose: () => void;
}

const EditListingForm = ({ listing, onClose }: EditListingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>((listing as any).photo_url || null);
  const { updateListing, fetchListings } = useListings();
  const { toast } = useToast();

  // Convert cents to dollars for display
  const convertCentsToDollars = (cents: number): number => {
    return cents / 100;
  };

  // Convert dollars to cents for storage
  const convertDollarsToCents = (dollars: number): number => {
    return Math.round(dollars * 100);
  };

  const form = useForm<EditListingFormData>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      phase: listing.phase,
      agency: listing.agency,
      value: convertCentsToDollars(listing.value), // Convert to dollars for display
      deadline: listing.deadline,
      category: listing.category,
      status: listing.status,
      technology_summary: listing.technology_summary || "",
      // Admin-only fields
      agency_tracking_number: listing.agency_tracking_number || "",
      contract: listing.contract || "",
      proposal_award_date: listing.proposal_award_date || "",
      contract_end_date: listing.contract_end_date || "",
      topic_code: listing.topic_code || "",
      company: listing.company || "",
      address: listing.address || "",
      primary_investigator_name: listing.primary_investigator_name || "",
      pi_phone: listing.pi_phone || "",
      pi_email: listing.pi_email || "",
      business_contact_name: listing.business_contact_name || "",
      bc_phone: listing.bc_phone || "",
      bc_email: listing.bc_email || "",
      admin_notes: "",
    },
  });

  const onSubmit = async (data: EditListingFormData) => {
    try {
      setIsSubmitting(true);
      
      // Extract admin notes for audit purposes
      const { admin_notes, ...listingUpdateData } = data;
      
      // Include photo_url, date_sold, and technology_summary in the update data
      const updateData = {
        ...listingUpdateData,
        value: convertDollarsToCents(listingUpdateData.value), // Convert back to cents for storage
        photo_url: photoUrl,
        date_sold: listing.date_sold,
        technology_summary: listingUpdateData.technology_summary || null,
        // Convert empty strings to null for admin-only fields
        agency_tracking_number: listingUpdateData.agency_tracking_number || null,
        contract: listingUpdateData.contract || null,
        proposal_award_date: listingUpdateData.proposal_award_date || null,
        contract_end_date: listingUpdateData.contract_end_date || null,
        topic_code: listingUpdateData.topic_code || null,
        company: listingUpdateData.company || null,
        address: listingUpdateData.address || null,
        primary_investigator_name: listingUpdateData.primary_investigator_name || null,
        pi_phone: listingUpdateData.pi_phone || null,
        pi_email: listingUpdateData.pi_email || null,
        business_contact_name: listingUpdateData.business_contact_name || null,
        bc_phone: listingUpdateData.bc_phone || null,
        bc_email: listingUpdateData.bc_email || null,
      } as Required<ExtendedEditListingFormData>;

      console.log('🔄 Updating listing with data:', { listingId: listing.id, updateData, adminNotes: admin_notes });
      
      // Pass admin notes to the update function for audit logging
      await updateListing(listing.id, updateData, admin_notes || undefined);

      console.log('✅ Listing updated successfully, forcing data refresh...');

      // Force refresh the listings data
      await fetchListings();

      toast({
        title: "Listing Updated",
        description: "The listing has been successfully updated and logged for audit.",
      });

      // Close the dialog after successful update and refresh
      onClose();

    } catch (error) {
      console.error('❌ Error updating listing:', error);
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PhotoUpload
          currentPhotoUrl={photoUrl || undefined}
          onPhotoChange={setPhotoUrl}
          disabled={isSubmitting}
        />
        
        <StatusField form={form} />
        
        <ListingFormFields form={form} />
        
        <AdminOnlyFields form={form} />
        
        <AdminNotesField form={form} />

        <FormActions 
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default EditListingForm;
