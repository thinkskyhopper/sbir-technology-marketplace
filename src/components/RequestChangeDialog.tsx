
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { SBIRListing } from "@/types/listings";
import { useChangeRequests } from "@/hooks/useChangeRequests";
import { listingSchema } from "./CreateListingDialog/listingSchema";
import ListingFormFields from "./CreateListingDialog/ListingFormFields";

interface RequestChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing | null;
  requestType: 'change' | 'deletion';
}

// Schema for change requests - conditional based on request type
const createChangeRequestSchema = (requestType: 'change' | 'deletion') => {
  const baseSchema = z.object({
    reason: z.string().min(10, "Please provide a reason for this request (minimum 10 characters)"),
  });

  if (requestType === 'change') {
    return baseSchema.extend({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      phase: z.enum(["Phase I", "Phase II"]),
      agency: z.string().min(1, "Agency is required"),
      value: z.number().min(1, "Value must be greater than 0"),
      deadline: z.string().min(1, "Deadline is required"),
      category: z.string().min(1, "Category is required"),
    });
  }
  
  return baseSchema;
};

const RequestChangeDialog = ({ open, onOpenChange, listing, requestType }: RequestChangeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createChangeRequest } = useChangeRequests();
  const { toast } = useToast();

  const schema = createChangeRequestSchema(requestType);
  type FormData = z.infer<typeof schema>;

  const defaultValues: FormData = requestType === 'change' ? {
    title: listing?.title || "",
    description: listing?.description || "",
    phase: listing?.phase || "Phase I",
    agency: listing?.agency || "",
    value: listing?.value || 0,
    deadline: listing?.deadline || "",
    category: listing?.category || "",
    reason: "",
  } as FormData : {
    reason: "",
  } as FormData;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormData) => {
    if (!listing) return;

    try {
      setIsSubmitting(true);
      
      const requestData = {
        listing_id: listing.id,
        request_type: requestType,
        reason: data.reason,
        requested_changes: requestType === 'change' ? {
          title: (data as any).title,
          description: (data as any).description,
          phase: (data as any).phase,
          agency: (data as any).agency,
          value: (data as any).value,
          deadline: (data as any).deadline,
          category: (data as any).category,
        } : null,
      };

      await createChangeRequest(requestData);

      toast({
        title: "Request Submitted",
        description: `Your ${requestType === 'change' ? 'change' : 'deletion'} request has been submitted successfully. You will be notified when an admin reviews it.`,
      });

      onOpenChange(false);
      form.reset();
      
    } catch (error) {
      console.error('Error submitting change request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    return requestType === 'change' ? 'Request Changes to Listing' : 'Request Listing Deletion';
  };

  const getDescription = () => {
    return requestType === 'change' 
      ? 'Make your desired changes and provide a reason for the request. An admin will review and approve or reject your request.'
      : 'Please provide a reason for requesting the deletion of this listing. An admin will review your request.';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {requestType === 'change' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Proposed Changes</h3>
                <ListingFormFields form={form as any} />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reason for {requestType === 'change' ? 'Changes' : 'Deletion'} *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Please explain why you are requesting ${requestType === 'change' ? 'these changes' : 'deletion of this listing'}...`}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : `Submit ${requestType === 'change' ? 'Change' : 'Deletion'} Request`}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestChangeDialog;
