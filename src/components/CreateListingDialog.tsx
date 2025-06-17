
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRateLimiting } from "@/hooks/useRateLimiting";
import { validateListingContent, isValidAgency } from "@/utils/contentValidation";
import { listingSchema, ListingFormData } from "./CreateListingDialog/listingSchema";
import ListingFormFields from "./CreateListingDialog/ListingFormFields";
import HoneypotField from "./CreateListingDialog/HoneypotField";
import { AlertTriangle, Shield } from "lucide-react";

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateListingDialog = ({ open, onOpenChange }: CreateListingDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [spamScore, setSpamScore] = useState(0);
  
  const { createListing } = useListings();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Rate limiting: max 3 submissions per hour per user
  const { isRateLimited, recordAttempt, getRemainingTime } = useRateLimiting('listing_creation', {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  });

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
    if (!user) return;

    // Check honeypot field
    if (honeypotValue) {
      toast({
        title: "Submission Failed",
        description: "Your submission was flagged as potential spam.",
        variant: "destructive",
      });
      return;
    }

    // Check rate limiting
    if (isRateLimited(user.id)) {
      const remainingTime = getRemainingTime(user.id);
      toast({
        title: "Rate Limit Exceeded",
        description: `Please wait ${Math.ceil(remainingTime / 60)} minutes before submitting another listing.`,
        variant: "destructive",
      });
      return;
    }

    // Validate content - ensure all required fields are present
    const contentValidationData = {
      title: data.title,
      description: data.description,
      agency: data.agency,
      category: data.category,
    };
    
    const validation = validateListingContent(contentValidationData);
    setValidationErrors(validation.errors);
    setSpamScore(validation.score);

    if (!validation.isValid) {
      toast({
        title: "Content Validation Failed",
        description: "Please review the content issues below.",
        variant: "destructive",
      });
      return;
    }

    // Validate agency
    if (!isValidAgency(data.agency)) {
      setValidationErrors(['Agency name does not appear to be a valid government organization']);
      toast({
        title: "Invalid Agency",
        description: "Please enter a valid government agency name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Record the attempt
      recordAttempt(user.id);
      
      // Create listing with "Pending" status for review
      const listingData = {
        title: data.title,
        description: data.description,
        phase: data.phase,
        agency: data.agency,
        value: data.value,
        deadline: data.deadline,
        category: data.category,
        status: 'Pending' as const
      };
      
      await createListing(listingData);

      toast({
        title: "Listing Submitted",
        description: "Your listing has been submitted for review and will be published once approved.",
      });

      form.reset();
      setHoneypotValue("");
      setValidationErrors([]);
      setSpamScore(0);
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

  const userAttempts = user ? isRateLimited(user.id) : false;
  const remainingTime = user ? getRemainingTime(user.id) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Create New SBIR Listing
          </DialogTitle>
        </DialogHeader>

        {userAttempts && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Rate limit exceeded. Please wait {Math.ceil(remainingTime / 60)} minutes before submitting another listing.
            </AlertDescription>
          </Alert>
        )}

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Content Issues Found:</div>
                <ul className="list-disc list-inside text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
                {spamScore > 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Spam score: {spamScore}/100
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <HoneypotField value={honeypotValue} onChange={setHoneypotValue} />
            
            <ListingFormFields form={form} />

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Spam Protection</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All listings are reviewed before publication. Please ensure your content is professional 
                and related to legitimate SBIR contracts.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || userAttempts}
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;
