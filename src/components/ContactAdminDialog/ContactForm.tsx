
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import type { SBIRListing } from "@/types/listings";
import FormFields from "./FormFields";
import { useContactForm } from "./useContactForm";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing;
  user: any;
}

const ContactForm = ({ open, onOpenChange, listing, user }: ContactFormProps) => {
  const { formData, setFormData, loading, handleSubmit } = useContactForm({
    user,
    listing,
    onSuccess: () => onOpenChange(false)
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact - {listing.title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormFields formData={formData} onFormDataChange={setFormData} />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
