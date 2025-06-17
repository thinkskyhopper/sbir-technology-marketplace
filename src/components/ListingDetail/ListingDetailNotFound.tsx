
import { Button } from "@/components/ui/button";

interface ListingDetailNotFoundProps {
  onReturnHome: () => void;
}

const ListingDetailNotFound = ({ onReturnHome }: ListingDetailNotFoundProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Technology Not Found</h1>
        <p className="text-muted-foreground mb-4">The technology you're looking for doesn't exist or has been removed.</p>
        <Button onClick={onReturnHome}>Return Home</Button>
      </div>
    </div>
  );
};

export default ListingDetailNotFound;
