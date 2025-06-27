
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  phaseFilter: string;
  setPhaseFilter: (value: string) => void;
  agencyFilter: string;
  setAgencyFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  uniqueAgencies: string[];
  uniqueCategories: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  phaseFilter,
  setPhaseFilter,
  agencyFilter,
  setAgencyFilter,
  categoryFilter,
  setCategoryFilter,
  uniqueAgencies,
  uniqueCategories,
  hasActiveFilters,
  onClearFilters
}: FilterBarProps) => {
  return (
    <div className="flex items-center space-x-4 mb-4 pb-4 border-b flex-wrap gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-64"
        />
      </div>
      <Select value={phaseFilter} onValueChange={setPhaseFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Phase" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Phases</SelectItem>
          <SelectItem value="Phase I">Phase I</SelectItem>
          <SelectItem value="Phase II">Phase II</SelectItem>
        </SelectContent>
      </Select>
      <Select value={agencyFilter} onValueChange={setAgencyFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Agency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Agencies</SelectItem>
          {uniqueAgencies.map(agency => (
            <SelectItem key={agency} value={agency}>{agency}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {uniqueCategories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
