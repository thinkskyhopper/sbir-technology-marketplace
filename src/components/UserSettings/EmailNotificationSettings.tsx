
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Bell, List, Tag } from 'lucide-react';

const EmailNotificationSettings = () => {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [listingEmailNotificationsEnabled, setListingEmailNotificationsEnabled] = useState(true);
  const [categoryEmailNotificationsEnabled, setCategoryEmailNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEmailNotificationPreferences();
  }, [user]);

  const fetchEmailNotificationPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications_enabled, listing_email_notifications_enabled, category_email_notifications_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setEmailNotificationsEnabled(data?.email_notifications_enabled ?? true);
      setListingEmailNotificationsEnabled(data?.listing_email_notifications_enabled ?? true);
      setCategoryEmailNotificationsEnabled(data?.category_email_notifications_enabled ?? true);
    } catch (error) {
      console.error('Error fetching email notification preferences:', error);
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
          : "All email notifications disabled. You'll only receive on-site notifications.",
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

  const handleToggleListingEmailNotifications = async (enabled: boolean) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ listing_email_notifications_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setListingEmailNotificationsEnabled(enabled);
      toast({
        title: "Success",
        description: enabled 
          ? "Listing email notifications enabled" 
          : "Listing email notifications disabled",
      });
    } catch (error) {
      console.error('Error updating listing email notification preference:', error);
      toast({
        title: "Error",
        description: "Failed to update listing email notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCategoryEmailNotifications = async (enabled: boolean) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ category_email_notifications_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setCategoryEmailNotificationsEnabled(enabled);
      toast({
        title: "Success",
        description: enabled 
          ? "Category email notifications enabled" 
          : "Category email notifications disabled",
      });
    } catch (error) {
      console.error('Error updating category email notification preference:', error);
      toast({
        title: "Error",
        description: "Failed to update category email notification preferences",
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
        {/* Master Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="email-notifications" className="text-base font-medium">
              Master Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Turn off all email notifications. You'll only receive in-app notifications.
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotificationsEnabled}
            onCheckedChange={handleToggleEmailNotifications}
            disabled={saving}
          />
        </div>

        {/* Individual Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Individual Controls</h4>
          
          {/* Listing Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="listing-notifications" className="text-base font-medium flex items-center gap-2">
                <List className="w-4 h-4" />
                Listing Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications about your listing submissions and change requests
              </p>
            </div>
            <Switch
              id="listing-notifications"
              checked={listingEmailNotificationsEnabled}
              onCheckedChange={handleToggleListingEmailNotifications}
              disabled={saving || !emailNotificationsEnabled}
            />
          </div>

          {/* Category Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="category-notifications" className="text-base font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Daily notifications about new listings in your selected categories
              </p>
            </div>
            <Switch
              id="category-notifications"
              checked={categoryEmailNotificationsEnabled}
              onCheckedChange={handleToggleCategoryEmailNotifications}
              disabled={saving || !emailNotificationsEnabled}
            />
          </div>
        </div>

        {/* Information Box */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">How this works</p>
              <p className="text-sm text-muted-foreground mt-1">
                {!emailNotificationsEnabled 
                  ? "All email notifications are disabled. You'll only receive notifications within the app."
                  : "You'll receive email notifications based on your individual preferences above, plus in-app notifications."
                }
              </p>
              {!emailNotificationsEnabled && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Note:</strong> Individual controls are disabled when master notifications are off.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailNotificationSettings;
