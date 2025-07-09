
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
  const { updateListing } = useListings();
  const { toast } = useToast();

  const form = useForm<EditListingFormData>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      phase: listing.phase,
      agency: listing.agency,
      value: listing.value,
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
    },
  });

  const onSubmit = async (data: EditListingFormData) => {
    try {
      setIsSubmitting(true);
      
      // Include photo_url, date_sold, and technology_summary in the update data
      const updateData = {
        ...data,
        photo_url: photoUrl,
        date_sold: listing.date_sold,
        technology_summary: data.technology_summary || null,
        // Convert empty strings to null for admin-only fields
        agency_tracking_number: data.agency_tracking_number || null,
        contract: data.contract || null,
        proposal_award_date: data.proposal_award_date || null,
        contract_end_date: data.contract_end_date || null,
        topic_code: data.topic_code || null,
        company: data.company || null,
        address: data.address || null,
        primary_investigator_name: data.primary_investigator_name || null,
        pi_phone: data.pi_phone || null,
        pi_email: data.pi_email || null,
        business_contact_name: data.business_contact_name || null,
        bc_phone: data.bc_phone || null,
        bc_email: data.bc_email || null,
      } as Required<ExtendedEditListingFormData>;

      console.log('🔄 Updating listing with data:', { listingId: listing.id, updateData });
      await updateListing(listing.id, updateData);

      console.log('✅ Listing updated successfully, refreshing data...');

      toast({
        title: "Listing Updated",
        description: "The listing has been successfully updated.",
      });

      // Close the dialog and let the parent component handle the refresh
      onClose();
      
      // Force a page reload to ensure all components reflect the changes
      // This is a reliable way to ensure the entire page reflects the updates
      setTimeout(() => {
        window.location.reload();
      }, 100);

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

        <FormActions 
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default EditListingForm;
