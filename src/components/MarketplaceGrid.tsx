
import { useState } from "react";
import MarketplaceCard, { SBIRListing } from "./MarketplaceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

// Mock data for demonstration
const mockListings: SBIRListing[] = [
  {
    id: "1",
    title: "Advanced AI-Powered Cybersecurity Platform for Military Networks",
    phase: "Phase II",
    agency: "Department of Defense",
    value: 1750000,
    deadline: "2024-08-15",
    description: "Development of next-generation cybersecurity platform utilizing machine learning and artificial intelligence to protect critical military infrastructure from advanced persistent threats.",
    category: "Cybersecurity",
    status: "Active",
    submittedAt: "2024-06-10"
  },
  {
    id: "2",
    title: "Quantum Communication Systems for Secure Military Operations",
    phase: "Phase I",
    agency: "Air Force Research Laboratory",
    value: 275000,
    deadline: "2024-07-30",
    description: "Research and prototype development of quantum-encrypted communication systems for secure military operations in contested environments.",
    category: "Communications",
    status: "Active",
    submittedAt: "2024-06-08"
  },
  {
    id: "3",
    title: "Autonomous Drone Swarm Technology for Reconnaissance",
    phase: "Phase II",
    agency: "Navy Research Office",
    value: 2100000,
    deadline: "2024-09-01",
    description: "Advanced autonomous drone swarm technology for intelligence gathering and reconnaissance missions in complex operational environments.",
    category: "Autonomous Systems",
    status: "Active",
    submittedAt: "2024-06-05"
  },
  {
    id: "4",
    title: "Lightweight Ballistic Protection Materials Research",
    phase: "Phase I",
    agency: "Army Research Laboratory",
    value: 325000,
    deadline: "2024-08-20",
    description: "Development of next-generation lightweight ballistic protection materials using advanced composite technologies.",
    category: "Materials Science",
    status: "Pending",
    submittedAt: "2024-06-12"
  }
];

interface MarketplaceGridProps {
  searchQuery?: string;
  onListingSelect?: (listing: SBIRListing) => void;
  onContactAdmin?: (listing: SBIRListing) => void;
}

const MarketplaceGrid = ({ searchQuery, onListingSelect, onContactAdmin }: MarketplaceGridProps) => {
  const [listings] = useState<SBIRListing[]>(mockListings);
  const [filteredListings, setFilteredListings] = useState<SBIRListing[]>(mockListings);
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
  useState(() => {
    applyFilters();
  });

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const categories = Array.from(new Set(listings.map(listing => listing.category)));

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
            onViewDetails={onListingSelect}
            onContact={onContactAdmin}
          />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No contracts found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setLocalSearchQuery("");
              setPhaseFilter("all");
              setCategoryFilter("all");
              setStatusFilter("active");
              applyFilters();
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
