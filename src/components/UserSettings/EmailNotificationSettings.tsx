
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Bell } from 'lucide-react';

const EmailNotificationSettings = () => {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEmailNotificationPreference();
  }, [user]);

  const fetchEmailNotificationPreference = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setEmailNotificationsEnabled(data?.email_notifications_enabled ?? true);
    } catch (error) {
      console.error('Error fetching email notification preference:', error);
      toast({
        title: "Error",
        description: "Failed to load email notification preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmailNotifications = async (enabled: boolean) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ email_notifications_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setEmailNotificationsEnabled(enabled);
      toast({
        title: "Success",
        description: enabled 
          ? "Email notifications enabled" 
          : "Email notifications disabled. You'll only receive on-site notifications.",
      });
    } catch (error) {
      console.error('Error updating email notification preference:', error);
      toast({
        title: "Error",
        description: "Failed to update email notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="email-notifications" className="text-base font-medium">
              Receive Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              When disabled, you'll only receive notifications within the app
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotificationsEnabled}
            onCheckedChange={handleToggleEmailNotifications}
            disabled={saving}
          />
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">How this works</p>
              <p className="text-sm text-muted-foreground mt-1">
                {emailNotificationsEnabled 
                  ? "You'll receive notifications both via email and within the app when new listings match your preferences."
                  : "You'll only receive notifications within the app. No emails will be sent to you."
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailNotificationSettings;
