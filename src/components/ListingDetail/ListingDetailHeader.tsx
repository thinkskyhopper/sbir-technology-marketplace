
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, DollarSign, ArrowLeft, Mail, Edit } from "lucide-react";
import ShareButton from "@/components/ShareButton";

interface ListingDetailHeaderProps {
  listing: {
    id: string;
    phase: string;
    status: string;
    title: string;
    agency: string;
    value: number;
  };
  isAdmin: boolean;
  onBackToMarketplace: () => void;
  onContactAdmin: () => void;
  onEditListing: () => void;
}

const ListingDetailHeader = ({
  listing,
  isAdmin,
  onBackToMarketplace,
  onContactAdmin,
  onEditListing
}: ListingDetailHeaderProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-card border-b">
      <div className="container mx-auto px-6 py-4">
        <Button 
          variant="ghost" 
          onClick={onBackToMarketplace}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={listing.phase === "Phase I" ? "default" : "secondary"}>
                {listing.phase}
              </Badge>
              <Badge 
                variant={listing.status === "Active" ? "default" : "outline"}
                className={listing.status === "Active" ? "bg-green-600" : ""}
              >
                {listing.status}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            
            <div className="flex items-center text-muted-foreground mb-4">
              <Building className="w-4 h-4 mr-2" />
              {listing.agency}
            </div>
            
            <div className="flex items-center text-2xl font-bold text-green-600">
              <DollarSign className="w-6 h-6 mr-1" />
              {formatCurrency(listing.value)}
            </div>
          </div>
          
          <div className="ml-6 flex items-center space-x-2">
            <ShareButton 
              listingId={listing.id}
              listingTitle={listing.title}
            />
            {isAdmin && (
              <Button 
                variant="outline"
                onClick={onEditListing}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Listing
              </Button>
            )}
            <Button 
              size="lg"
              onClick={onContactAdmin}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailHeader;
