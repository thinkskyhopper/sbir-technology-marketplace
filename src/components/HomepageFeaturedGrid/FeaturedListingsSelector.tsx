
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePagination } from '@/hooks/usePagination';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import type { SBIRListing } from '@/types/listings';

interface FeaturedListingsSelectorProps {
  listings: SBIRListing[];
  selectedListings: SBIRListing[];
  onSelectionChange: (selected: SBIRListing[]) => void;
}

const FeaturedListingsSelector = ({
  listings,
  selectedListings,
  onSelectionChange
}: FeaturedListingsSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [agencyFilter, setAgencyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const selectedIds = useMemo(() => 
    new Set(selectedListings.map(l => l.id)), 
    [selectedListings]
  );

  const uniqueAgencies = useMemo(() => {
    const agencies = [...new Set(listings.map(listing => listing.agency))];
    return agencies.sort();
  }, [listings]);

  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(listings.map(listing => listing.category))];
    return categories.sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = searchTerm === '' || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPhase = phaseFilter === 'all' || listing.phase === phaseFilter;
      const matchesAgency = agencyFilter === 'all' || listing.agency === agencyFilter;
      const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
      
      return matchesSearch && matchesPhase && matchesAgency && matchesCategory;
    });
  }, [listings, searchTerm, phaseFilter, agencyFilter, categoryFilter]);

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedListings,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    resetPagination
  } = usePagination({
    data: filteredListings,
    itemsPerPage: 12
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setPhaseFilter('all');
    setAgencyFilter('all');
    setCategoryFilter('all');
    resetPagination();
  };

  const hasActiveFilters = searchTerm !== '' || phaseFilter !== 'all' || agencyFilter !== 'all' || categoryFilter !== 'all';

  const handleListingToggle = (listing: SBIRListing, checked: boolean) => {
    if (checked) {
      if (selectedListings.length >= 6) {
        return; // Don't allow more than 6 selections
      }
      onSelectionChange([...selectedListings, listing]);
    } else {
      onSelectionChange(selectedListings.filter(l => l.id !== listing.id));
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [searchTerm, phaseFilter, agencyFilter, categoryFilter, resetPagination]);

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
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
            onClick={handleClearFilters}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {/* Selection Info */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {selectedListings.length} of 6 listings selected
        </p>
        <p className="text-sm text-muted-foreground">
          Showing {paginatedListings.length} of {filteredListings.length} listings
        </p>
      </div>

      {/* Listings List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {paginatedListings.map((listing) => {
            const isSelected = selectedIds.has(listing.id);
            const canSelect = selectedListings.length < 6 || isSelected;
            
            return (
              <div
                key={listing.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg ${
                  isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                } ${!canSelect ? 'opacity-50' : ''}`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleListingToggle(listing, checked as boolean)}
                  disabled={!canSelect}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium truncate">{listing.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {listing.phase}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{listing.agency}</span>
                    <span>${listing.value.toLocaleString()}</span>
                    <span>{listing.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {paginatedListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No listings match your filters.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={goToPreviousPage}
                  className={!hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => goToPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={goToNextPage}
                  className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default FeaturedListingsSelector;
