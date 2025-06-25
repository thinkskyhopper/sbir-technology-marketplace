
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useListings } from "@/hooks/useListings";
import type { SBIRListing } from "@/types/listings";
import { useToast } from "@/hooks/use-toast";
import { listingSchema, ListingFormData } from "./CreateListingDialog/listingSchema";
import ListingFormFields from "./CreateListingDialog/ListingFormFields";
import PhotoUpload from "./PhotoUpload";
import { z } from "zod";

interface EditListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing | null;
}

// Extend the form schema to include status
const editListingSchema = listingSchema.extend({
  status: z.enum(['Active', 'Pending', 'Sold', 'Rejected', 'Hidden']),
});

type EditListingFormData = z.infer<typeof editListingSchema>;

// Extend the form data to include photo_url and status
interface ExtendedEditListingFormData extends EditListingFormData {
  photo_url?: string;
}

const EditListingDialog = ({ open, onOpenChange, listing }: EditListingDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { updateListing } = useListings();
  const { toast } = useToast();

  const form = useForm<EditListingFormData>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: "",
      description: "",
      phase: "Phase I",
      agency: "",
      value: 0,
      deadline: "",
      category: "",
      status: "Pending",
    },
  });

  // Update form values when listing changes
  useEffect(() => {
    if (listing) {
      form.reset({
        title: listing.title,
        description: listing.description,
        phase: listing.phase,
        agency: listing.agency,
        value: listing.value,
        deadline: listing.deadline,
        category: listing.category,
        status: listing.status,
      });
      setPhotoUrl((listing as any).photo_url || null);
    }
  }, [listing, form]);

  const onSubmit = async (data: EditListingFormData) => {
    if (!listing) return;

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
      onOpenChange(false);
      
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      case 'Sold':
        return 'outline';
      case 'Hidden':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Edit SBIR Listing
            {listing && (
              <Badge variant={getStatusBadgeVariant(listing.status)}>
                {listing.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PhotoUpload
              currentPhotoUrl={photoUrl || undefined}
              onPhotoChange={setPhotoUrl}
              disabled={isSubmitting}
            />
            
            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Hidden">Hidden</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <ListingFormFields form={form} />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingDialog;
