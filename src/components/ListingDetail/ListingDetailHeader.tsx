
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, DollarSign, ArrowLeft, Mail, Edit, Trash2 } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import { useState } from "react";

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
  onDeleteListing?: (listingId: string) => void;
}

const ListingDetailHeader = ({
  listing,
  isAdmin,
  onBackToMarketplace,
  onContactAdmin,
  onEditListing,
  onDeleteListing
}: ListingDetailHeaderProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = () => {
    if (onDeleteListing) {
      onDeleteListing(listing.id);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
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
            
            <div className="ml-6 flex flex-col items-end space-y-2">
              {/* Main action buttons */}
              <div className="flex items-center space-x-2">
                <ShareButton 
                  listingId={listing.id}
                  listingTitle={listing.title}
                />
                <Button 
                  size="lg"
                  onClick={onContactAdmin}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
              
              {/* Admin-only buttons */}
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline"
                    onClick={onEditListing}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Listing
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmActionDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Listing"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
};

export default ListingDetailHeader;
