
import { useListings } from "@/hooks/useListings";

const ExpertValueStats = () => {
  const { listings, loading } = useListings();
  
  // Count active listings
  const activeListingsCount = listings.filter(listing => listing.status === 'Active').length;

  return (
    <section className="grid md:grid-cols-3 gap-8 mb-16">
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2">
          {loading ? "..." : activeListingsCount}
        </div>
        <div className="text-muted-foreground">Active Listings</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2">$50M+</div>
        <div className="text-muted-foreground">Contracts Facilitated</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2">30 Days</div>
        <div className="text-muted-foreground">Average Transaction Time</div>
      </div>
    </section>
  );
};

export default ExpertValueStats;
