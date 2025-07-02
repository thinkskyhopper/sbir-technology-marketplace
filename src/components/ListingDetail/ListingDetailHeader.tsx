
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, DollarSign, ArrowLeft, Mail, Edit, Trash2, FileEdit, UserX } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import BookmarkButton from "@/components/BookmarkButton";
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
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex-1 lg:pr-6">
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
              
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{listing.title}</h1>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <Building className="w-4 h-4 mr-2" />
                {listing.agency}
              </div>
              
              <div className="flex items-center text-xl sm:text-2xl font-bold text-green-600">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-1" />
                {formatCurrency(listing.value)}
              </div>
            </div>
            
            <div className="flex flex-col items-stretch lg:items-end space-y-3 w-full lg:w-auto lg:min-w-[300px]">
              {/* Main action buttons - optimized for mobile */}
              <div className="flex items-center gap-2 w-full">
                <BookmarkButton 
                  listingId={listing.id}
                  className="flex-shrink-0"
                  size="lg"
                />
                <ShareButton 
                  listingId={listing.id}
                  listingTitle={listing.title}
                  className="flex-shrink-0"
                />
                <Button 
                  size="lg"
                  onClick={onContactAdmin}
                  className="flex-1 min-w-0 text-sm sm:text-base px-3 sm:px-4"
                >
                  <Mail className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Contact</span>
                </Button>
              </div>
              
              {/* Admin-only buttons */}
              {isAdmin && (
                <div className="flex items-center gap-2 w-full">
                  <Button 
                    variant="outline"
                    onClick={onEditListing}
                    className="flex-1 min-w-0 text-sm px-2 sm:px-3"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Edit</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                    className="flex-1 min-w-0 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm px-2 sm:px-3"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Delete</span>
                  </Button>
                </div>
              )}
              
              {/* Owner-only buttons (non-admin users who own the listing) */}
              {canRequestChanges && (
                <div className="flex items-center gap-2 w-full">
                  <Button 
                    variant="outline"
                    onClick={onRequestChange}
                    className="flex-1 min-w-0 text-sm px-2 sm:px-3"
                    size="sm"
                  >
                    <FileEdit className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Request Changes</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={onRequestDeletion}
                    className="flex-1 min-w-0 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm px-2 sm:px-3"
                    size="sm"
                  >
                    <UserX className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Request Deletion</span>
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
