
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Browse = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse SBIR Listings</h1>
          <p className="text-muted-foreground">
            Discover available SBIR opportunities and listings
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border text-center">
          <h3 className="text-xl font-semibold mb-4">Browse Feature Coming Soon</h3>
          <p className="text-muted-foreground">
            We're working on building a comprehensive browse experience for SBIR listings.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
