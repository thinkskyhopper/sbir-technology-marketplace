import { Button } from "@/components/ui/button";
interface ExpertValueCTAProps {
  onScheduleConsultation: () => void;
  onExploreMarketplace: () => void;
  onContactUs: () => void;
}
const ExpertValueCTA = ({
  onScheduleConsultation,
  onExploreMarketplace,
  onContactUs
}: ExpertValueCTAProps) => {
  const handleScheduleConsultation = () => {
    window.open('https://scheduler.zoom.us/ted-dennis/ted-dennis-sbir-connect', '_blank');
  };
  return <section className="text-center bg-secondary/20 rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Schedule a free consultation with our SBIR experts and discover how we can help you navigate your next transaction with confidence.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={handleScheduleConsultation}>
          Schedule Free Consultation
        </Button>
        <Button size="lg" variant="outline" onClick={onExploreMarketplace}>
          Explore Marketplace
        </Button>
        <Button size="lg" variant="outline" onClick={onContactUs}>
          Contact Us
        </Button>
      </div>
    </section>;
};
export default ExpertValueCTA;