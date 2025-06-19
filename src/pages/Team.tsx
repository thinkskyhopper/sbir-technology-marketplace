import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamMembersList from "@/components/Team/TeamMembersList";
import CreateListingDialog from "@/components/CreateListingDialog";
import { useAuth } from "@/contexts/AuthContext";
const Team = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handlePostListingClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowCreateDialog(true);
  };
  return <div className="min-h-screen bg-background flex flex-col">
      <Header onPostListingClick={handlePostListingClick} />
      
      <div className="flex-1">
        <section className="py-16 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Our <span className="text-gradient">Expert Team</span>
              </h1>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed text-slate-50">
                Our team brings decades of experience in SBIR technology transfers, 
                defense contracting, and entrepreneurship to help you navigate complex transactions.
              </p>
            </div>
            
            <TeamMembersList />
          </div>
        </section>
      </div>

      <Footer />
      
      <CreateListingDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>;
};
export default Team;