import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, RotateCcw } from "lucide-react";

interface MarketplaceFiltersProps {
  localSearchQuery: string;
  phaseFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sortFilter: string;
  categories: string[];
  onSearchQueryChange: (query: string) => void;
  onPhaseFilterChange: (phase: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSortFilterChange: (sort: string) => void;
}

const MarketplaceFilters = ({
  localSearchQuery,
  phaseFilter,
  categoryFilter,
  statusFilter,
  sortFilter,
  categories,
  onSearchQueryChange,
  onPhaseFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onSortFilterChange
}: MarketplaceFiltersProps) => {
  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Since filters apply automatically, we don't need to do anything here
  };

  // Check if any filters are active (different from defaults)
  const hasActiveFilters = 
    localSearchQuery !== "" || 
    phaseFilter !== "all" || 
    categoryFilter !== "all" || 
    statusFilter !== "active" || 
    sortFilter !== "newest";

  const handleResetFilters = () => {
    onSearchQueryChange("");
    onPhaseFilterChange("all");
    onCategoryFilterChange("all");
    onStatusFilterChange("active");
    onSortFilterChange("newest");
  };

  // Sort categories alphabetically, but put "Other" at the end
  const sortedCategories = [...categories].sort((a, b) => {
    // If either category is "Other", handle special case
    if (a.toLowerCase() === "other") return 1;
    if (b.toLowerCase() === "other") return -1;
    // Otherwise sort alphabetically
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
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-10"
            />
          </form>
        </div>

        {/* Sort Filter */}
        <Select value={sortFilter} onValueChange={onSortFilterChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        {/* Phase Filter */}
        <Select value={phaseFilter} onValueChange={onPhaseFilterChange}>
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
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
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

        {/* Status Filter - Only show Active and Sold */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="default"
            onClick={handleResetFilters}
            className="w-full md:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default MarketplaceFilters;
