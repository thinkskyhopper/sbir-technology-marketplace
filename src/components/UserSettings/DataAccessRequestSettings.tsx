import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileSearch, Send, Loader2, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const DataAccessRequestSettings = () => {
  const [requestReason, setRequestReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmitRequest = async () => {
    if (!user || !requestReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      const requestData = {
        user_id: user.id,
        user_email: user.email,
        request_type: 'data_access',
        reason: requestReason.trim(),
        submitted_at: new Date().toISOString(),
      };

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          firstName: user.email?.split('@')[0] || 'User',
          lastName: '',
          email: user.email || '',
          company: '',
          message: `Data Access Request\n\nUser ID: ${user.id}\nEmail: ${user.email}\nReason: ${requestReason.trim()}\n\nThis is an automated data access request submitted through the user settings.`,
          howDidYouHear: 'User Settings - Data Access Request',
          honeypot: ''
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Request Submitted",
        description: "Your data access request has been submitted. We will respond within 30 days as required by law.",
      });

      setRequestReason('');

    } catch (error) {
      console.error('Error submitting data access request:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your request. Please try again or contact support directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="w-5 h-5" />
          Data Access & Correction Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Your Right to Access & Correct Data</p>
              <p className="text-sm text-muted-foreground mt-1">
                You have the right to request access to your personal data, request corrections to inaccurate data, 
                or ask questions about how your data is processed. We will respond within 30 days.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Common Request Types:</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Confirmation of what personal data we hold about you</li>
            <li>Correction of inaccurate or incomplete data</li>
            <li>Information about data processing purposes and legal basis</li>
            <li>Details about data sharing with third parties</li>
            <li>Information about data retention periods</li>
          </ul>
        </div>

        <div>
          <Label htmlFor="request-reason">Describe Your Request</Label>
          <Textarea
            id="request-reason"
            placeholder="Please describe what information you need or what corrections you're requesting. Be as specific as possible to help us respond accurately."
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            className="mt-2"
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Required: Please provide details about your request
          </p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Response Timeline</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                We will acknowledge your request within 48 hours and provide a complete response within 30 days as required by applicable privacy laws.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSubmitRequest} 
          disabled={isSubmitting || !requestReason.trim()}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataAccessRequestSettings;