
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SBIRListing } from "@/types/listings";
import type { FormData } from "./FormFields";

interface UseContactFormProps {
  user: any;
  listing: SBIRListing;
  onSuccess: () => void;
}

export const useContactForm = ({ user, listing, onSuccess }: UseContactFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    interestLevel: "",
    experience: "",
    timeline: "",
    message: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      interestLevel: "",
      experience: "",
      timeline: "",
      message: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      console.log('Sending contact inquiry...', {
        formData,
        listing: {
          id: listing.id,
          title: listing.title,
          agency: listing.agency,
          value: listing.value,
          phase: listing.phase
        },
        userEmail: user.email
      });

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          listing: {
            id: listing.id,
            title: listing.title,
            agency: listing.agency,
            value: listing.value,
            phase: listing.phase
          },
          userEmail: user.email
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Contact email sent successfully:', data);

      toast({
        title: "Message Sent",
        description: "Your inquiry has been sent to our team. We'll get back to you soon!",
      });
      
      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit
  };
};
