
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface MarketplaceFiltersProps {
  localSearchQuery: string;
  phaseFilter: string;
  categoryFilter: string;
  statusFilter: string;
  categories: string[];
  onSearchQueryChange: (query: string) => void;
  onPhaseFilterChange: (phase: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
}

const MarketplaceFilters = ({
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
  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Since filters apply automatically, we don't need to do anything here
  };

  return (
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
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Phase Filter */}
        <Select value={phaseFilter} onValueChange={onPhaseFilterChange}>
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
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
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
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
