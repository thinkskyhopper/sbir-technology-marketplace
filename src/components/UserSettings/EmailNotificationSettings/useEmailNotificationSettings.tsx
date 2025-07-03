
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEmailNotificationSettings = () => {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [listingEmailNotificationsEnabled, setListingEmailNotificationsEnabled] = useState(true);
  const [categoryEmailNotificationsEnabled, setCategoryEmailNotificationsEnabled] = useState(true);
  const [marketingEmailsEnabled, setMarketingEmailsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchEmailNotificationPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications_enabled, listing_email_notifications_enabled, category_email_notifications_enabled, marketing_emails_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setEmailNotificationsEnabled(data?.email_notifications_enabled ?? true);
      setListingEmailNotificationsEnabled(data?.listing_email_notifications_enabled ?? true);
      setCategoryEmailNotificationsEnabled(data?.category_email_notifications_enabled ?? true);
      setMarketingEmailsEnabled(data?.marketing_emails_enabled ?? false);
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

  const handleToggleMarketingEmails = async (enabled: boolean) => {
    if (!profile) return;

    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ marketing_emails_enabled: enabled })
        .eq('id', profile.id);

      if (error) {
        throw error;
      }

      setMarketingEmailsEnabled(enabled);
      toast({
        title: "Settings updated",
        description: `Marketing emails ${enabled ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating marketing email settings:', error);
      toast({
        title: "Error",
        description: "Failed to update marketing email settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchEmailNotificationPreferences();
  }, [user]);

  return {
    emailNotificationsEnabled,
    listingEmailNotificationsEnabled,
    categoryEmailNotificationsEnabled,
    marketingEmailsEnabled,
    loading,
    saving,
    handleToggleEmailNotifications,
    handleToggleListingEmailNotifications,
    handleToggleCategoryEmailNotifications,
    handleToggleMarketingEmails,
  };
};
