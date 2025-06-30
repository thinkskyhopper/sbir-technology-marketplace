import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Building, Mail, Clock, Tag, Settings } from "lucide-react";
import ListingDetailRelatedListings from "./ListingDetailRelatedListings";
import type { SBIRListing } from "@/types/listings";

interface ListingDetailSidebarProps {
  listing: {
    deadline: string;
    value: number;
    agency: string;
    submitted_at: string;
    approved_at?: string | null;
    category: string;
    phase: string;
  };
  onContactAdmin: () => void;
  allListings?: SBIRListing[];
  isCurrentUserAdmin?: boolean;
}

const ListingDetailSidebar = ({ 
  listing, 
  onContactAdmin, 
  allListings = [], 
  isCurrentUserAdmin = false 
}: ListingDetailSidebarProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // Parse the date string as a local date to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Use approved_at if available, otherwise fall back to submitted_at
  const dateListedValue = listing.approved_at || listing.submitted_at;

  return (
    <div className="space-y-6">
      {/* Key Information */}
      <Card>
        <CardHeader>
          <CardTitle>Key Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <div>
              <p className="font-semibold">Date Listed</p>
              <p className="text-muted-foreground">
                {listing.approved_at ? formatDateTime(listing.approved_at) : formatDateTime(listing.submitted_at)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-red-500" />
            <div>
              <p className="font-semibold">Deadline</p>
              <p className="text-muted-foreground">{formatDate(listing.deadline)}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
            <div>
              <p className="font-semibold">Sale Price</p>
              <p className="text-muted-foreground">{formatCurrency(listing.value)}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Building className="w-4 h-4 mr-2 text-blue-500" />
            <div>
              <p className="font-semibold">Agency</p>
              <p className="text-muted-foreground">{listing.agency}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Settings className="w-4 h-4 mr-2 text-purple-500" />
            <div>
              <p className="font-semibold">Phase</p>
              <p className="text-muted-foreground">{listing.phase}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <Tag className="w-4 h-4 mr-2 text-orange-500" />
            <div>
              <p className="font-semibold">Category</p>
              <p className="text-muted-foreground">{listing.category}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Interested?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Contact our team to learn more about this opportunity and discuss the acquisition process.
          </p>
          
          <Button 
            className="w-full"
            onClick={onContactAdmin}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>• Verified opportunity details</p>
            <p>• Expert guidance included</p>
            <p>• Secure transaction process</p>
          </div>
        </CardContent>
      </Card>

      {/* Related Listings */}
      {allListings.length > 0 && (
        <ListingDetailRelatedListings
          currentListing={listing as SBIRListing}
          allListings={allListings}
          isCurrentUserAdmin={isCurrentUserAdmin}
        />
      )}
    </div>
  );
};

export default ListingDetailSidebar;
