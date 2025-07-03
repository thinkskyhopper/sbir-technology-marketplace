
import { List, Tag, Megaphone } from 'lucide-react';
import EmailNotificationCard from './EmailNotificationSettings/EmailNotificationCard';
import MasterToggle from './EmailNotificationSettings/MasterToggle';
import NotificationToggle from './EmailNotificationSettings/NotificationToggle';
import InfoBox from './EmailNotificationSettings/InfoBox';
import LoadingState from './EmailNotificationSettings/LoadingState';
import { useEmailNotificationSettings } from './EmailNotificationSettings/useEmailNotificationSettings';

const EmailNotificationSettings = () => {
  const {
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
  } = useEmailNotificationSettings();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <EmailNotificationCard>
      {/* Master Toggle */}
      <MasterToggle
        enabled={emailNotificationsEnabled}
        onToggle={handleToggleEmailNotifications}
        disabled={saving}
      />

      {/* Individual Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Individual Controls</h4>
        
        {/* Listing Notifications */}
        <NotificationToggle
          id="listing-notifications"
          title="Listing Notifications"
          description="Notifications about your listing submissions and change requests"
          icon={<List className="w-4 h-4" />}
          checked={listingEmailNotificationsEnabled}
          onCheckedChange={handleToggleListingEmailNotifications}
          disabled={saving || !emailNotificationsEnabled}
        />

        {/* Category Notifications */}
        <NotificationToggle
          id="category-notifications"
          title="Category Notifications"
          description="Daily notifications about new listings in your selected categories"
          icon={<Tag className="w-4 h-4" />}
          checked={categoryEmailNotificationsEnabled}
          onCheckedChange={handleToggleCategoryEmailNotifications}
          disabled={saving || !emailNotificationsEnabled}
        />

        {/* Marketing Emails */}
        <NotificationToggle
          id="marketing-emails"
          title="Marketing Communications"
          description="Receive updates about new features, industry insights, and special offers"
          icon={<Megaphone className="w-4 h-4" />}
          checked={marketingEmailsEnabled}
          onCheckedChange={handleToggleMarketingEmails}
          disabled={saving}
        />
      </div>

      {/* Information Box */}
      <InfoBox emailNotificationsEnabled={emailNotificationsEnabled} />
    </EmailNotificationCard>
  );
};

export default EmailNotificationSettings;
