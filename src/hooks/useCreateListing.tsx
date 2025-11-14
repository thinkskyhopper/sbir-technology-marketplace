
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
  const { user, profile, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Rate limiting: max 3 submissions per hour per user
  const { isRateLimited, recordAttempt, getRemainingTime } = useRateLimiting('listing_creation', {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  });

  const onSubmit = async (data: ListingFormData) => {
    if (!user) return;

    // Check if user has permission to submit listings (admins always can)
    const canSubmitListings = isAdmin || (profile?.can_submit_listings ?? false);
    
    if (!canSubmitListings) {
      toast({
        title: "Submission Not Allowed",
        description: "Your account does not have permission to submit listings. Please contact support if you believe this is an error.",
        variant: "destructive",
      });
      return;
    }

    // Check honeypot field
    if (honeypotValue) {
      toast({
        title: "Submission Failed",
        description: "Your submission was flagged as potential spam.",
        variant: "destructive",
      });
      return;
    }

    // Check rate limiting - exempt admins from rate limiting
    if (!isAdmin && isRateLimited(user.id)) {
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
      
      // Record the attempt only for non-admin users
      if (!isAdmin) {
        recordAttempt(user.id);
      }
      
      // Create listing with "Pending" status for review
      const listingData = {
        title: data.title,
        description: data.description,
        phase: data.phase,
        agency: data.agency,
        value: data.value,
        category: data.category,
        listing_type: data.listing_type,
        status: 'Pending' as const
      };
      
      console.log('🔄 Starting listing creation process...', { 
        user: user.id, 
        title: data.title, 
        isAdmin,
        inputValue: data.value,
        valueType: typeof data.value
      });
      
      await createListing(listingData);

      console.log('✅ Listing creation completed successfully');

      toast({
        title: "Listing Submitted",
        description: "Your listing has been submitted for review and will be published once approved.",
      });

      // Reset form and validation state
      form.reset();
      setValidationErrors([]);
      setSpamScore(0);
      
      // Call onSuccess callback
      onSuccess();
    } catch (error) {
      console.error('❌ Error in listing creation process:', error);
      
      // Handle specific Supabase errors
      let errorMessage = 'Unknown error occurred';
      let errorTitle = 'Error';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const supabaseError = error as any;
        
        switch (supabaseError.code) {
          case '42501': // Permission denied
            errorTitle = 'Permission Error';
            errorMessage = 'You do not have permission to create listings. Please make sure you are signed in and have the necessary permissions.';
            break;
          case '23505': // Unique constraint violation
            errorTitle = 'Duplicate Entry';
            errorMessage = 'A listing with similar details already exists.';
            break;
          case '23503': // Foreign key violation
            errorTitle = 'Invalid Data';
            errorMessage = 'Some of the listing data is invalid. Please check your entries and try again.';
            break;
          case '23514': // Check constraint violation
            errorTitle = 'Invalid Values';
            errorMessage = 'Please check that all values are valid and within acceptable ranges.';
            break;
          default:
            if (supabaseError.message) {
              errorMessage = supabaseError.message;
            }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: `Failed to create listing: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin users are never rate limited
  const userAttempts = user && !isAdmin ? isRateLimited(user.id) : false;
  const remainingTime = user && !isAdmin ? getRemainingTime(user.id) : 0;

  return {
    onSubmit,
    isSubmitting,
    validationErrors,
    spamScore,
    userAttempts,
    remainingTime
  };
};
