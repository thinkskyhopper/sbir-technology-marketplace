
import { useState } from "react";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRateLimiting } from "@/hooks/useRateLimiting";
import { validateListingContent } from "@/utils/contentValidation";
import { ListingFormData } from "@/components/CreateListingDialog/listingSchema";
import { UseFormReturn } from "react-hook-form";

interface UseCreateListingProps {
  form: UseFormReturn<ListingFormData>;
  honeypotValue: string;
  onSuccess: () => void;
}

export const useCreateListing = ({ form, honeypotValue, onSuccess }: UseCreateListingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setValidationErrors([]);
      setSpamScore(0);
      onSuccess();
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

  return {
    onSubmit,
    isSubmitting,
    validationErrors,
    spamScore,
    userAttempts,
    remainingTime
  };
};
