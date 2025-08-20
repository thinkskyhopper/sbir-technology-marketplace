import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";

interface SignInPromptCardProps {
  onSignIn: () => void;
}

const SignInPromptCard = ({ onSignIn }: SignInPromptCardProps) => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm mb-1">
              Have SBIR technology to share?
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Join our marketplace and connect with potential buyers and partners.
            </p>
            <Button 
              onClick={onSignIn}
              size="sm"
              className="w-full sm:w-auto"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In to Submit Listing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInPromptCard;