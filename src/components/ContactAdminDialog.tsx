
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";
import SignInPrompt from "./ContactAdminDialog/SignInPrompt";
import ContactForm from "./ContactAdminDialog/ContactForm";

interface ContactAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing;
}

const ContactAdminDialog = ({ open, onOpenChange, listing }: ContactAdminDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  if (!user) {
    return (
      <SignInPrompt 
        open={open} 
        onOpenChange={onOpenChange} 
        onSignIn={handleSignIn}
      />
    );
  }

  return (
    <ContactForm 
      open={open} 
      onOpenChange={onOpenChange} 
      listing={listing}
      user={user}
    />
  );
};

export default ContactAdminDialog;
