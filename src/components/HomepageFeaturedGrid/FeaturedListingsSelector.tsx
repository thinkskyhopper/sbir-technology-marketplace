
import { useState, useMemo, useEffect } from 'react';
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
import FilterBar from './FilterBar';
import ListingItem from './ListingItem';
import SelectionInfo from './SelectionInfo';
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

  const PaginationComponent = () => (
    totalPages > 1 && (
      <div className="py-4">
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
    )
  );

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        phaseFilter={phaseFilter}
        setPhaseFilter={setPhaseFilter}
        agencyFilter={agencyFilter}
        setAgencyFilter={setAgencyFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        uniqueAgencies={uniqueAgencies}
        uniqueCategories={uniqueCategories}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <SelectionInfo
        selectedCount={selectedListings.length}
        maxSelections={6}
        displayedCount={paginatedListings.length}
        totalCount={filteredListings.length}
      />

      {/* Top Pagination */}
      <PaginationComponent />

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-2 pr-4">
          {paginatedListings.map((listing) => {
            const isSelected = selectedIds.has(listing.id);
            const canSelect = selectedListings.length < 6 || isSelected;
            
            return (
              <ListingItem
                key={listing.id}
                listing={listing}
                isSelected={isSelected}
                canSelect={canSelect}
                onToggle={handleListingToggle}
              />
            );
          })}
          
          {paginatedListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No listings match your filters.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Pagination */}
      <PaginationComponent />
    </div>
  );
};

export default FeaturedListingsSelector;
