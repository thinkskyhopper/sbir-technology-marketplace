
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useListings, SBIRListing } from "@/hooks/useListings";
import { useToast } from "@/hooks/use-toast";
import { listingSchema, ListingFormData } from "./CreateListingDialog/listingSchema";
import ListingFormFields from "./CreateListingDialog/ListingFormFields";

interface EditListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing | null;
}

const EditListingDialog = ({ open, onOpenChange, listing }: EditListingDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateListing } = useListings();
  const { toast } = useToast();

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      phase: "Phase I",
      agency: "",
      value: 0,
      deadline: "",
      category: "",
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
      });
    }
  }, [listing, form]);

  const onSubmit = async (data: ListingFormData) => {
    if (!listing) return;

    try {
      setIsSubmitting(true);
      await updateListing(listing.id, data as Required<ListingFormData>);

      toast({
        title: "Listing Updated",
        description: "The listing has been successfully updated.",
      });

      onOpenChange(false);
    } catch (error) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit SBIR Listing</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
