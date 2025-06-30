
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileListings from "@/components/Profile/ProfileListings";

const Profile = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <ProfileHeader />
          <ProfileListings />
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
