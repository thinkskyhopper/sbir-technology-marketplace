
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SignInPrompt from "./GenericContactDialog/SignInPrompt";
import ContactForm from "./GenericContactDialog/ContactForm";

interface GenericContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

const GenericContactDialog = ({ open, onOpenChange, title = "Contact Us" }: GenericContactDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <ContactForm 
      open={open} 
      onOpenChange={onOpenChange} 
      title={title}
      userEmail={user?.email || ""}
    />
  );
};

export default GenericContactDialog;
