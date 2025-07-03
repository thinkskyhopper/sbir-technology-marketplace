
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailNotificationSettings from "@/components/UserSettings/EmailNotificationSettings";
import CategoryNotificationSettings from "@/components/UserSettings/CategoryNotificationSettings";
import AccountDeletionSettings from "@/components/UserSettings/AccountDeletionSettings";

const UserSettingsContent = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and notification settings.
        </p>
      </div>
      
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-6">
          <EmailNotificationSettings />
          <CategoryNotificationSettings />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountDeletionSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettingsContent;
