
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PermissionDeniedMessage = () => {
  const [isContacting, setIsContacting] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const handleContactAdmin = async () => {
    if (!user || !profile) return;

    setIsContacting(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: profile.full_name || 'User',
          email: profile.email,
          subject: 'Request to Enable Listing Submissions',
          message: 'Hello, I would like to request permission to submit SBIR listings. My account currently has listing submissions disabled. Please enable this feature for my account. Thank you.',
          inquirerType: 'user'
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Request Sent",
        description: "Your request has been sent to the administrators. They will review and respond soon.",
      });
    } catch (error) {
      console.error('Error sending contact request:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again or contact support directly.",
        variant: "destructive",
      });
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <strong>Listing Submission Disabled</strong>
            <p className="text-sm mt-1">
              Your account does not currently have permission to submit listings. This may be due to administrative restrictions or account limitations.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleContactAdmin}
            disabled={isContacting}
            className="bg-white hover:bg-gray-50"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isContacting ? 'Sending...' : 'Request Permission'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PermissionDeniedMessage;
