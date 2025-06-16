
import { useState } from "react";
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
import { useListings } from "@/hooks/useListings";
import { useToast } from "@/hooks/use-toast";
import { listingSchema, ListingFormData } from "./CreateListingDialog/listingSchema";
import ListingFormFields from "./CreateListingDialog/ListingFormFields";

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateListingDialog = ({ open, onOpenChange }: CreateListingDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createListing } = useListings();
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

  const onSubmit = async (data: ListingFormData) => {
    try {
      setIsSubmitting(true);
      await createListing(data);

      toast({
        title: "Listing Created",
        description: "The new listing has been successfully created and is now active.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
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
          <DialogTitle>Create New SBIR Listing</DialogTitle>
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
                {isSubmitting ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;
