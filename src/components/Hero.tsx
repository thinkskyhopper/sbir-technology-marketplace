
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onExploreClick?: () => void;
}

const Hero = ({ onExploreClick }: HeroProps) => {
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate('/expert-value');
    window.scrollTo(0, 0);
  };

  return (
    <section className="hero-gradient pt-28 pb-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo Image */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/lovable-uploads/fe6674f8-0ad3-409f-ad77-bbca62b6a379.png" 
              alt="The SBIR Tech Marketplace"
              className="h-auto w-auto max-w-xs sm:max-w-xl"
            />
          </div>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground">Connect innovation with opportunity. Buy and sell Phase I & II SBIR technology in a secure, professional marketplace designed for defense contractors and innovators.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" onClick={onExploreClick} className="px-8 py-6 text-lg">
              Explore Marketplace
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleLearnMoreClick} className="border-primary/20 hover:border-primary/40 px-8 py-6 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
