
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface SignInPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: () => void;
}

const SignInPrompt = ({ open, onOpenChange, onSignIn }: SignInPromptProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Sign In Required
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-6">
            Please sign in to contact our team about this SBIR technology.
          </p>
          <Button onClick={onSignIn} className="w-full">
            Sign In to Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPrompt;
