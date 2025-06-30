
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, DollarSign, ArrowLeft, Mail, Edit, Trash2, FileEdit, UserX } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ListingDetailHeaderProps {
  listing: {
    id: string;
    phase: string;
    status: string;
    title: string;
    agency: string;
    value: number;
    user_id: string;
  };
  isAdmin: boolean;
  onBackToMarketplace: () => void;
  onContactAdmin: () => void;
  onEditListing: () => void;
  onDeleteListing?: (listingId: string) => void;
  onRequestChange?: () => void;
  onRequestDeletion?: () => void;
}

const ListingDetailHeader = ({
  listing,
  isAdmin,
  onBackToMarketplace,
  onContactAdmin,
  onEditListing,
  onDeleteListing,
  onRequestChange,
  onRequestDeletion
}: ListingDetailHeaderProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();

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

  // Check if current user owns this listing
  const isOwner = user?.id === listing.user_id;
  const canRequestChanges = isOwner && !isAdmin;

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
                <Badge 
                  variant={listing.phase === "Phase I" ? "default" : "secondary"}
                  className={listing.phase === "Phase II" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
                >
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
              
              {/* Owner-only buttons (non-admin users who own the listing) */}
              {canRequestChanges && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline"
                    onClick={onRequestChange}
                  >
                    <FileEdit className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={onRequestDeletion}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Request Deletion
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
