
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface MarketplaceFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  initialFilters?: {
    search: string;
    phase: string;
    category: string;
    status: string;
  };
  // New props for MarketplaceGrid compatibility
  localSearchQuery?: string;
  phaseFilter?: string;
  categoryFilter?: string;
  statusFilter?: string;
  categories?: string[];
  onSearchQueryChange?: (query: string) => void;
  onPhaseFilterChange?: (phase: string) => void;
  onCategoryFilterChange?: (category: string) => void;
  onStatusFilterChange?: (status: string) => void;
}

const MarketplaceFilters = ({
  onFilterChange,
  initialFilters,
  localSearchQuery,
  phaseFilter,
  categoryFilter,
  statusFilter,
  categories,
  onSearchQueryChange,
  onPhaseFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange
}: MarketplaceFiltersProps) => {
  // Use controlled props if available, otherwise use local state
  const [localSearchState, setLocalSearchState] = useState(initialFilters?.search || "");
  const [phaseFilterState, setPhaseFilterState] = useState(initialFilters?.phase || "all");
  const [categoryFilterState, setCategoryFilterState] = useState(initialFilters?.category || "all");
  const [statusFilterState, setStatusFilterState] = useState(initialFilters?.status || "all");

  // Determine which values to use (controlled vs uncontrolled)
  const searchValue = localSearchQuery !== undefined ? localSearchQuery : localSearchState;
  const phaseValue = phaseFilter !== undefined ? phaseFilter : phaseFilterState;
  const categoryValue = categoryFilter !== undefined ? categoryFilter : categoryFilterState;
  const statusValue = statusFilter !== undefined ? statusFilter : statusFilterState;

  // Default categories list
  const defaultCategories = [
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

  const categoriesToUse = categories || defaultCategories;

  // Update local state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setLocalSearchState(initialFilters.search);
      setPhaseFilterState(initialFilters.phase);
      setCategoryFilterState(initialFilters.category);
      setStatusFilterState(initialFilters.status);
    }
  }, [initialFilters]);

  // Notify parent of filter changes (for Index.tsx compatibility)
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        search: searchValue,
        phase: phaseValue,
        category: categoryValue,
        status: statusValue
      });
    }
  }, [searchValue, phaseValue, categoryValue, statusValue, onFilterChange]);

  const handleSearchChange = (value: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(value);
    } else {
      setLocalSearchState(value);
    }
  };

  const handlePhaseChange = (value: string) => {
    if (onPhaseFilterChange) {
      onPhaseFilterChange(value);
    } else {
      setPhaseFilterState(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (onCategoryFilterChange) {
      onCategoryFilterChange(value);
    } else {
      setCategoryFilterState(value);
    }
  };

  const handleStatusChange = (value: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(value);
    } else {
      setStatusFilterState(value);
    }
  };

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters apply automatically through useEffect or controlled props
  };

  // Sort categories alphabetically, but put "Other" at the end
  const sortedCategories = [...categoriesToUse].sort((a, b) => {
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
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </form>
        </div>

        {/* Phase Filter */}
        <Select value={phaseValue} onValueChange={handlePhaseChange}>
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
        <Select value={categoryValue} onValueChange={handleCategoryChange}>
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
        <Select value={statusValue} onValueChange={handleStatusChange}>
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
