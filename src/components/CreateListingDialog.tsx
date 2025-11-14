
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { useTabVisibility } from "@/hooks/useTabVisibility";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Shield } from "lucide-react";
import { listingSchema, ListingFormData } from "./CreateListingDialog/listingSchema";
import ListingFormFields from "./CreateListingDialog/ListingFormFields";
import HoneypotField from "./CreateListingDialog/HoneypotField";
import ValidationAlerts from "./CreateListingDialog/ValidationAlerts";
import SpamProtectionInfo from "./CreateListingDialog/SpamProtectionInfo";
import DialogActions from "./CreateListingDialog/DialogActions";
import { useCreateListing } from "@/hooks/useCreateListing";

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateListingDialog = ({ open, onOpenChange }: CreateListingDialogProps) => {
  const [honeypotValue, setHoneypotValue] = useState("");
  const { toast } = useToast();
  const isTabVisible = useTabVisibility();

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      phase: "Phase I",
      agency: "",
      value: 0,
      category: "",
      listing_type: "Contract",
    },
  });

  // Form persistence
  const storageKey = 'create-listing-draft';
  const { loadFormData, clearFormData } = useFormPersistence({
    storageKey,
    form,
    enabled: open
  });

  // Track form changes for unsaved changes warning
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    onSubmit,
    isSubmitting,
    validationErrors,
    spamScore,
    userAttempts,
    remainingTime
  } = useCreateListing({
    form,
    honeypotValue,
    onSuccess: () => {
      setHoneypotValue("");
      clearFormData();
      setHasUnsavedChanges(false);
      onOpenChange(false);
    }
  });
  
  useUnsavedChangesWarning({
    hasUnsavedChanges: hasUnsavedChanges && open && !isSubmitting
  });

  // Load saved data when dialog opens
  useEffect(() => {
    if (open) {
      const hasLoadedData = loadFormData();
      if (hasLoadedData) {
        setHasUnsavedChanges(true);
        toast({
          title: "Draft Restored",
          description: "Your previous listing draft has been restored.",
        });
      }
    }
  }, [open, loadFormData, toast]);

  // Track form changes
  useEffect(() => {
    if (!open) return;
    
    const subscription = form.watch((value, { name }) => {
      if (name) {
        const formData = form.getValues();
        const hasNonEmptyFields = Object.values(formData).some(val => 
          val !== "" && val !== 0 && val !== null && val !== undefined
        );
        setHasUnsavedChanges(hasNonEmptyFields);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, open]);

  // Clear changes state when dialog closes
  useEffect(() => {
    if (!open) {
      setHasUnsavedChanges(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Create New SBIR Listing
          </DialogTitle>
        </DialogHeader>

        <ValidationAlerts 
          userAttempts={userAttempts}
          remainingTime={remainingTime}
          validationErrors={validationErrors}
          spamScore={spamScore}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <HoneypotField value={honeypotValue} onChange={setHoneypotValue} />
            
            <ListingFormFields form={form} />

            <SpamProtectionInfo />

            <DialogActions 
              isSubmitting={isSubmitting}
              userAttempts={userAttempts}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;
