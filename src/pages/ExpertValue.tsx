
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateListingDialog from "@/components/CreateListingDialog";
import GenericContactDialog from "@/components/GenericContactDialog";
import ExpertValueHero from "@/components/ExpertValue/ExpertValueHero";
import ExpertValueStats from "@/components/ExpertValue/ExpertValueStats";
import ExpertValueProcess from "@/components/ExpertValue/ExpertValueProcess";
import ExpertValueTestimonial from "@/components/ExpertValue/ExpertValueTestimonial";
import ExpertValueCTA from "@/components/ExpertValue/ExpertValueCTA";
import { useAuth } from "@/contexts/AuthContext";

const ExpertValue = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePostListingClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowCreateDialog(true);
  };

  const handleScheduleConsultation = () => {
    window.open('https://scheduler.zoom.us/ted-dennis/ted-dennis-sbir-connect', '_blank');
  };

  const handleExploreMarketplace = () => {
    navigate('/?view=marketplace');
  };

  const handleContactUs = () => {
    setShowContactDialog(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onPostListingClick={handlePostListingClick} />
      
      <div className="flex-1">
        <section className="py-16 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-6">
            <ExpertValueHero />
            <ExpertValueStats />
            <ExpertValueProcess />
            <ExpertValueTestimonial />
            <ExpertValueCTA 
              onScheduleConsultation={handleScheduleConsultation}
              onExploreMarketplace={handleExploreMarketplace}
              onContactUs={handleContactUs}
            />
          </div>
        </section>
      </div>

      <Footer />
      
      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      
      <GenericContactDialog 
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        title="Contact Us"
      />
    </div>
  );
};

export default ExpertValue;
