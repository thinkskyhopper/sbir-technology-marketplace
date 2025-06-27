
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, DollarSign, Building, FileText, Edit } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import ContactAdminDialog from "./ContactAdminDialog";

interface MarketplaceCardProps {
  listing: SBIRListing;
  onViewDetails?: (listing: SBIRListing) => void;
  onContact?: (listing: SBIRListing) => void;
  onEdit?: (listing: SBIRListing) => void;
}

const MarketplaceCard = ({ listing, onViewDetails, onContact, onEdit }: MarketplaceCardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const [showContactDialog, setShowContactDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // Parse the date string as a local date to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = () => {
    // Preserve current search parameters when navigating to listing detail
    const currentParams = new URLSearchParams(searchParams);
    const listingUrl = `/listing/${listing.id}`;
    
    // Add current search params to the listing URL if they exist
    if (currentParams.toString()) {
      navigate(`${listingUrl}?${currentParams.toString()}`);
    } else {
      navigate(listingUrl);
    }
  };

  const handleContactAdmin = () => {
    setShowContactDialog(true);
  };

  return (
    <>
      <Card className="card-hover bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="default" className="text-xs">
              {listing.phase}
            </Badge>
            <div className="flex gap-1">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onEdit?.(listing)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
              <Badge 
                variant={listing.status === "Active" ? "default" : "outline"}
                className={listing.status === "Active" ? "bg-green-600" : ""}
              >
                {listing.status}
              </Badge>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold line-clamp-2 text-foreground">
            {listing.title}
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="w-4 h-4 mr-1" />
            {listing.agency}
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {listing.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                <span className="font-semibold text-foreground">{formatCurrency(listing.value)}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {listing.category}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              Deadline: {formatDate(listing.deadline)}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleViewDetails}
          >
            <FileText className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleContactAdmin}
          >
            Contact
          </Button>
        </CardFooter>
      </Card>

      <ContactAdminDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        listing={listing}
      />
    </>
  );
};

export default MarketplaceCard;
