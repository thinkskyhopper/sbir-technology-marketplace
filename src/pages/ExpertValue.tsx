
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import ExpertValueHero from "@/components/ExpertValue/ExpertValueHero";
import ExpertValueStats from "@/components/ExpertValue/ExpertValueStats";
import ExpertValueBenefits from "@/components/ExpertValue/ExpertValueBenefits";
import ExpertValueProcess from "@/components/ExpertValue/ExpertValueProcess";
import ExpertValueTestimonial from "@/components/ExpertValue/ExpertValueTestimonial";
import ExpertValueCTA from "@/components/ExpertValue/ExpertValueCTA";
import CalendlyDialog from "@/components/ExpertValue/CalendlyDialog";
import GenericContactDialog from "@/components/GenericContactDialog";

const ExpertValue = () => {
  const navigate = useNavigate();
  const [showCalendly, setShowCalendly] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const handleScheduleConsultation = () => {
    setShowCalendly(true);
  };

  const handleExploreMarketplace = () => {
    navigate('/?view=marketplace');
  };

  const handleContactUs = () => {
    setShowContactDialog(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-6 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <ExpertValueHero />
          <ExpertValueStats />
          <ExpertValueBenefits />
          <ExpertValueProcess />
          <ExpertValueTestimonial />
          <ExpertValueCTA 
            onScheduleConsultation={handleScheduleConsultation}
            onExploreMarketplace={handleExploreMarketplace}
            onContactUs={handleContactUs}
          />

          <CalendlyDialog 
            open={showCalendly} 
            onOpenChange={setShowCalendly}
          />

          <GenericContactDialog
            open={showContactDialog}
            onOpenChange={setShowContactDialog}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExpertValue;
