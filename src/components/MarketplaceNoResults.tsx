
import { Button } from "@/components/ui/button";

interface MarketplaceNoResultsProps {
  onClearFilters: () => void;
}

const MarketplaceNoResults = ({ onClearFilters }: MarketplaceNoResultsProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-lg">No opportunities found matching your criteria.</p>
      <Button 
        variant="outline" 
        onClick={onClearFilters}
        className="mt-4"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default MarketplaceNoResults;
