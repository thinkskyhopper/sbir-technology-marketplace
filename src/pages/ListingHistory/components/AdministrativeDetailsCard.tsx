
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { SBIRListing } from "@/types/listings";

interface AdministrativeDetailsCardProps {
  listing: SBIRListing;
}

export const AdministrativeDetailsCard = ({ listing }: AdministrativeDetailsCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrative Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {listing.internal_title && (
            <div>
              <p className="text-sm text-muted-foreground">Internal Title</p>
              <p className="font-medium">{listing.internal_title}</p>
            </div>
          )}
          
          {listing.internal_description && (
            <div>
              <p className="text-sm text-muted-foreground">Internal Description</p>
              <p className="font-medium whitespace-pre-wrap">{listing.internal_description}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listing.agency_tracking_number && (
            <div>
              <p className="text-sm text-muted-foreground">Agency Tracking Number</p>
              <p className="font-medium">{listing.agency_tracking_number}</p>
            </div>
          )}
          
          {listing.topic_code && (
            <div>
              <p className="text-sm text-muted-foreground">Topic Code</p>
              <p className="font-medium">{listing.topic_code}</p>
            </div>
          )}
          
          {listing.company && (
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">{listing.company}</p>
            </div>
          )}
          
          {listing.contract && (
            <div>
              <p className="text-sm text-muted-foreground">Contract</p>
              <p className="font-medium">{listing.contract}</p>
            </div>
          )}
          
          {listing.proposal_award_date && (
            <div>
              <p className="text-sm text-muted-foreground">Proposal Award Date</p>
              <p className="font-medium">{formatDate(listing.proposal_award_date)}</p>
            </div>
          )}
          
          {listing.contract_end_date && (
            <div>
              <p className="text-sm text-muted-foreground">Contract End Date</p>
              <p className="font-medium">{formatDate(listing.contract_end_date)}</p>
            </div>
          )}
        </div>
        
        {listing.address && (
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{listing.address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
