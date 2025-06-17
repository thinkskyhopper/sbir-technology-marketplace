
import { useState, useEffect } from "react";
import MarketplaceCard from "./MarketplaceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, AlertCircle } from "lucide-react";
import { useListings, SBIRListing } from "@/hooks/useListings";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MarketplaceGridProps {
  searchQuery?: string;
  onContactAdmin?: (listing: SBIRListing) => void;
}

const MarketplaceGrid = ({ searchQuery, onContactAdmin }: MarketplaceGridProps) => {
  const { listings, loading, error } = useListings();
  const [filteredListings, setFilteredListings] = useState<SBIRListing[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const applyFilters = () => {
    let filtered = listings;

    // Apply search query (from prop or local)
    const query = searchQuery || localSearchQuery;
    if (query) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase()) ||
        listing.agency.toLowerCase().includes(query.toLowerCase()) ||
        listing.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply phase filter
    if (phaseFilter !== "all") {
      filtered = filtered.filter(listing => listing.phase === phaseFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(listing => listing.status === "Active");
    } else if (statusFilter !== "all") {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFilteredListings(filtered);
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [listings, searchQuery, localSearchQuery, phaseFilter, categoryFilter, statusFilter]);

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const categories = Array.from(new Set(listings.map(listing => listing.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading contracts: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <form onSubmit={handleLocalSearch} className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search contracts..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Phase Filter */}
          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="Phase I">Phase I</SelectItem>
              <SelectItem value="Phase II">Phase II</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={applyFilters} className="mt-4">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            listing={listing}
            onContact={onContactAdmin}
          />
        ))}
      </div>

      {filteredListings.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No contracts found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setLocalSearchQuery("");
              setPhaseFilter("all");
              setCategoryFilter("all");
              setStatusFilter("active");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarketplaceGrid;
