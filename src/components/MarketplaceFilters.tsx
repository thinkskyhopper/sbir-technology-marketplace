
import SearchInput from "./MarketplaceFilters/SearchInput";
import FilterSelects from "./MarketplaceFilters/FilterSelects";
import ResetButton from "./MarketplaceFilters/ResetButton";

interface MarketplaceFiltersProps {
  localSearchQuery: string;
  phaseFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sortFilter: string;
  typeFilter: string;
  categories: string[];
  onSearchQueryChange: (query: string) => void;
  onPhaseFilterChange: (phase: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSortFilterChange: (sort: string) => void;
  onTypeFilterChange: (type: string) => void;
}

const MarketplaceFilters = ({
  localSearchQuery,
  phaseFilter,
  categoryFilter,
  statusFilter,
  sortFilter,
  typeFilter,
  categories,
  onSearchQueryChange,
  onPhaseFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onSortFilterChange,
  onTypeFilterChange
}: MarketplaceFiltersProps) => {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          localSearchQuery={localSearchQuery}
          onSearchQueryChange={onSearchQueryChange}
        />

        <FilterSelects
          phaseFilter={phaseFilter}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          sortFilter={sortFilter}
          typeFilter={typeFilter}
          categories={categories}
          onPhaseFilterChange={onPhaseFilterChange}
          onCategoryFilterChange={onCategoryFilterChange}
          onStatusFilterChange={onStatusFilterChange}
          onSortFilterChange={onSortFilterChange}
          onTypeFilterChange={onTypeFilterChange}
        />

        <ResetButton
          localSearchQuery={localSearchQuery}
          phaseFilter={phaseFilter}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          sortFilter={sortFilter}
          typeFilter={typeFilter}
          onSearchQueryChange={onSearchQueryChange}
          onPhaseFilterChange={onPhaseFilterChange}
          onCategoryFilterChange={onCategoryFilterChange}
          onStatusFilterChange={onStatusFilterChange}
          onSortFilterChange={onSortFilterChange}
          onTypeFilterChange={onTypeFilterChange}
        />
      </div>
    </div>
  );
};

export default MarketplaceFilters;
