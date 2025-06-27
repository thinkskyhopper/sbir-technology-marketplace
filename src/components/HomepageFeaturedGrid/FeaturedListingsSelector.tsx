
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  const selectedIds = useMemo(() => 
    new Set(selectedListings.map(l => l.id)), 
    [selectedListings]
  );

  const uniqueAgencies = useMemo(() => {
    const agencies = [...new Set(listings.map(listing => listing.agency))];
    return agencies.sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = searchTerm === '' || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPhase = phaseFilter === 'all' || listing.phase === phaseFilter;
      const matchesAgency = agencyFilter === 'all' || listing.agency === agencyFilter;
      
      return matchesSearch && matchesPhase && matchesAgency;
    });
  }, [listings, searchTerm, phaseFilter, agencyFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setPhaseFilter('all');
    setAgencyFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || phaseFilter !== 'all' || agencyFilter !== 'all';

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

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="flex items-center space-x-4 mb-4 pb-4 border-b">
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
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {selectedListings.length} of 6 listings selected
        </p>
      </div>

      {/* Listings List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredListings.map((listing) => {
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
          
          {filteredListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No listings match your filters.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FeaturedListingsSelector;
