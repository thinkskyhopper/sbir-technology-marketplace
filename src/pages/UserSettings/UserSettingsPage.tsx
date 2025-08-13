
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserSettingsContent from "./UserSettingsContent";
import CreateListingDialog from "@/components/CreateListingDialog";
import { useNavigate } from "react-router-dom";

const UserSettingsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handlePostListingClick = () => {
    setShowCreateDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onPostListingClick={handlePostListingClick} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onPostListingClick={handlePostListingClick} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">Please sign in to access your settings.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onPostListingClick={handlePostListingClick} />
      <div className="flex-1">
        <UserSettingsContent />
      </div>
      <Footer />
      
      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default UserSettingsPage;
