import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Send, Loader2, Shield, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const DATA_TYPES = [
  'Email addresses',
  'Names',
  'Phone numbers',
  'Company information',
  'Account passwords',
  'Profile information',
  'Listing data',
  'Communication history',
  'Usage analytics',
  'Payment information'
];

const BreachNotificationAdmin = () => {
  const [formData, setFormData] = useState({
    subject: '',
    incident_date: '',
    affected_data_types: [] as string[],
    steps_taken: '',
    user_actions_required: '',
    contact_info: 'security@yourdomain.com | 1-800-XXX-XXXX',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const isAdmin = profile?.role === 'admin';

  const handleDataTypeToggle = (dataType: string) => {
    setFormData(prev => ({
      ...prev,
      affected_data_types: prev.affected_data_types.includes(dataType)
        ? prev.affected_data_types.filter(type => type !== dataType)
        : [...prev.affected_data_types, dataType]
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNotification = async () => {
    if (!user || !isAdmin) return;
    
    // Validation
    if (!formData.subject || !formData.incident_date || !formData.steps_taken || !formData.user_actions_required) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.affected_data_types.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one affected data type.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const { data, error } = await supabase.functions.invoke('send-breach-notification', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: formData
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Notification Sent",
        description: `Breach notification sent successfully to ${data.statistics?.total_recipients || 0} users.`,
      });

      // Reset form
      setFormData({
        subject: '',
        incident_date: '',
        affected_data_types: [],
        steps_taken: '',
        user_actions_required: '',
        contact_info: 'security@yourdomain.com | 1-800-XXX-XXXX',
        message: ''
      });

    } catch (error) {
      console.error('Error sending breach notification:', error);
      toast({
        title: "Notification Failed",
        description: "Failed to send breach notification. Please try again or contact technical support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Security Breach Notification (Admin Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Critical Security Function</p>
              <p className="text-sm text-muted-foreground mt-1">
                Use this tool to notify all users about security breaches as required by privacy laws. 
                This will send notifications to all users with email notifications enabled.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subject">Email Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g., Important Security Notice - Action Required"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="incident_date">Incident Date *</Label>
            <Input
              id="incident_date"
              type="date"
              value={formData.incident_date}
              onChange={(e) => handleInputChange('incident_date', e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label>Affected Data Types * (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {DATA_TYPES.map((dataType) => (
              <div key={dataType} className="flex items-center space-x-2">
                <Checkbox
                  id={dataType}
                  checked={formData.affected_data_types.includes(dataType)}
                  onCheckedChange={() => handleDataTypeToggle(dataType)}
                />
                <label
                  htmlFor={dataType}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {dataType}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="steps_taken">Steps Taken to Address the Incident *</Label>
          <Textarea
            id="steps_taken"
            placeholder="Describe what actions were taken immediately after discovering the breach, security measures implemented, etc."
            value={formData.steps_taken}
            onChange={(e) => handleInputChange('steps_taken', e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="user_actions_required">Recommended User Actions *</Label>
          <Textarea
            id="user_actions_required"
            placeholder="Describe what users should do to protect themselves (e.g., change passwords, monitor accounts, etc.)"
            value={formData.user_actions_required}
            onChange={(e) => handleInputChange('user_actions_required', e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="contact_info">Contact Information</Label>
          <Input
            id="contact_info"
            placeholder="Contact details for users who have questions"
            value={formData.contact_info}
            onChange={(e) => handleInputChange('contact_info', e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Notification Recipients</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                This notification will be sent to all registered users who have email notifications enabled in their account settings.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSubmitNotification} 
          disabled={isSubmitting}
          className="w-full"
          variant="destructive"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Breach Notification...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Breach Notification to All Users
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BreachNotificationAdmin;