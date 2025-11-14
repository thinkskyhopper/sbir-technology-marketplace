import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSelectsProps {
  phaseFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sortFilter: string;
  typeFilter: string;
  categories: string[];
  onPhaseFilterChange: (phase: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSortFilterChange: (sort: string) => void;
  onTypeFilterChange: (type: string) => void;
}

const FilterSelects = ({
  phaseFilter,
  categoryFilter,
  statusFilter,
  sortFilter,
  typeFilter,
  categories,
  onPhaseFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onSortFilterChange,
  onTypeFilterChange
}: FilterSelectsProps) => {
  // Sort categories alphabetically, but put "Other" at the end
  const sortedCategories = [...categories].sort((a, b) => {
    // If either category is "Other", handle special case
    if (a.toLowerCase() === "other") return 1;
    if (b.toLowerCase() === "other") return -1;
    // Otherwise sort alphabetically
    return a.localeCompare(b);
  });

  return (
    <>
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

      {/* Type Filter */}
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Contract">Contract</SelectItem>
          <SelectItem value="IP">IP</SelectItem>
          <SelectItem value="Contract & IP">Contract & IP</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default FilterSelects;
