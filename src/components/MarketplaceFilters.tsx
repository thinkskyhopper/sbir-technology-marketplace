
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface MarketplaceFiltersProps {
  onFilterChange: (filters: Record<string, string>) => void;
  initialFilters: {
    search: string;
    phase: string;
    category: string;
    status: string;
  };
}

const MarketplaceFilters = ({
  onFilterChange,
  initialFilters
}: MarketplaceFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(initialFilters.search);
  const [phaseFilter, setPhaseFilter] = useState(initialFilters.phase);
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.category);
  const [statusFilter, setStatusFilter] = useState(initialFilters.status);

  // Categories list - you can make this dynamic later if needed
  const categories = [
    "Cybersecurity",
    "Software",
    "Hardware",
    "AI/Machine Learning",
    "Autonomous Systems",
    "Biomedical",
    "Quantum Technologies",
    "Space Technologies",
    "Advanced Materials",
    "Other"
  ];

  // Update local state when initialFilters change
  useEffect(() => {
    setLocalSearchQuery(initialFilters.search);
    setPhaseFilter(initialFilters.phase);
    setCategoryFilter(initialFilters.category);
    setStatusFilter(initialFilters.status);
  }, [initialFilters]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      search: localSearchQuery,
      phase: phaseFilter,
      category: categoryFilter,
      status: statusFilter
    });
  }, [localSearchQuery, phaseFilter, categoryFilter, statusFilter, onFilterChange]);

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters apply automatically through useEffect
  };

  // Sort categories alphabetically, but put "Other" at the end
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.toLowerCase() === "other") return 1;
    if (b.toLowerCase() === "other") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <form onSubmit={handleLocalSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </form>
        </div>

        {/* Phase Filter */}
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            <SelectItem value="Phase I">Phase I</SelectItem>
            <SelectItem value="Phase II">Phase II</SelectItem>
            <SelectItem value="Phase III">Phase III</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {sortedCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Awarded">Awarded</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
