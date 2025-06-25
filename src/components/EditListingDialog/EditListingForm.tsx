
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
import { z } from "zod";
import type { SBIRListing } from "@/types/listings";

// Extend the form schema to include status
const editListingSchema = listingSchema.extend({
  status: z.enum(['Active', 'Pending', 'Sold', 'Rejected', 'Hidden']),
});

type EditListingFormData = z.infer<typeof editListingSchema>;

// Extend the form data to include photo_url and status
interface ExtendedEditListingFormData extends EditListingFormData {
  photo_url?: string;
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
    },
  });

  const onSubmit = async (data: EditListingFormData) => {
    try {
      setIsSubmitting(true);
      
      // Include photo_url in the update data
      const updateData = {
        ...data,
        photo_url: photoUrl,
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

        <FormActions 
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default EditListingForm;
