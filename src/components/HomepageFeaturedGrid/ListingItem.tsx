
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { SBIRListing } from '@/types/listings';

interface ListingItemProps {
  listing: SBIRListing;
  isSelected: boolean;
  canSelect: boolean;
  onToggle: (listing: SBIRListing, checked: boolean) => void;
}

const ListingItem = ({
  listing,
  isSelected,
  canSelect,
  onToggle
}: ListingItemProps) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 border rounded-lg ${
        isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
      } ${!canSelect ? 'opacity-50' : ''}`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onToggle(listing, checked as boolean)}
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
};

export default ListingItem;
