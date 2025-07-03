
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';

const MarketingEmailSettings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [marketingEmailsEnabled, setMarketingEmailsEnabled] = useState(
    profile?.marketing_emails_enabled || false
  );

  const handleMarketingEmailsToggle = async (enabled: boolean) => {
    if (!profile) return;

    setIsUpdating(true);
    
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
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Communications</CardTitle>
        <CardDescription>
          Control whether you receive marketing emails and newsletter updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-emails" className="text-base">
              Marketing emails and newsletter updates
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about new features, industry insights, and special offers
            </p>
          </div>
          <Switch
            id="marketing-emails"
            checked={marketingEmailsEnabled}
            onCheckedChange={handleMarketingEmailsToggle}
            disabled={isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingEmailSettings;
