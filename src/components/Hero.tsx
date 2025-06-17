
import { Button } from "@/components/ui/button";
import { Shield, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onExploreClick?: () => void;
}

const Hero = ({ onExploreClick }: HeroProps) => {
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate('/expert-value');
  };

  return (
    <section className="hero-gradient py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The Future of{" "}
            <span className="text-gradient">SBIR Contract</span>{" "}
            Exchange
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect innovation with opportunity. Buy and sell Phase I & II SBIR contracts 
            in a secure, professional marketplace designed for defense contractors and innovators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={onExploreClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Explore Marketplace
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleLearnMoreClick}
              className="border-primary/20 hover:border-primary/40 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Contracts</h3>
              <p className="text-muted-foreground">All listings are reviewed and verified by our expert team</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Precision Matching</h3>
              <p className="text-muted-foreground">Advanced search and filtering to find exactly what you need</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Execution</h3>
              <p className="text-muted-foreground">Streamlined process from discovery to contract transfer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
