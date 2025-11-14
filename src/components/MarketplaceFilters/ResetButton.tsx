
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ResetButtonProps {
  localSearchQuery: string;
  phaseFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sortFilter: string;
  typeFilter: string;
  onSearchQueryChange: (query: string) => void;
  onPhaseFilterChange: (phase: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSortFilterChange: (sort: string) => void;
  onTypeFilterChange: (type: string) => void;
}

const ResetButton = ({
  localSearchQuery,
  phaseFilter,
  categoryFilter,
  statusFilter,
  sortFilter,
  typeFilter,
  onSearchQueryChange,
  onPhaseFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onSortFilterChange,
  onTypeFilterChange
}: ResetButtonProps) => {
  // Check if any filters are active (different from defaults)
  const hasActiveFilters = 
    localSearchQuery !== "" || 
    phaseFilter !== "all" || 
    categoryFilter !== "all" || 
    statusFilter !== "all" || // Changed from "active" to "all"
    sortFilter !== "newest" ||
    typeFilter !== "all";

  const handleResetFilters = () => {
    onSearchQueryChange("");
    onPhaseFilterChange("all");
    onCategoryFilterChange("all");
    onStatusFilterChange("all"); // Changed from "active" to "all"
    onSortFilterChange("newest");
    onTypeFilterChange("all");
  };

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleResetFilters}
      className="w-full md:w-auto"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Reset
    </Button>
  );
};

export default ResetButton;
