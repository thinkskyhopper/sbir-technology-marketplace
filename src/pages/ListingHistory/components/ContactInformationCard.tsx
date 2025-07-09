
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, Phone, Mail } from "lucide-react";
import type { SBIRListing } from "@/types/listings";

interface ContactInformationCardProps {
  listing: SBIRListing;
}

export const ContactInformationCard = ({ listing }: ContactInformationCardProps) => {
  if (!listing.primary_investigator_name && !listing.business_contact_name) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {listing.primary_investigator_name && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Primary Investigator</span>
            </h4>
            <div className="ml-6 space-y-1">
              <p className="font-medium">{listing.primary_investigator_name}</p>
              {listing.pi_phone && (
                <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{listing.pi_phone}</span>
                </p>
              )}
              {listing.pi_email && (
                <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span>{listing.pi_email}</span>
                </p>
              )}
            </div>
          </div>
        )}
        
        {listing.business_contact_name && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Business Contact</span>
            </h4>
            <div className="ml-6 space-y-1">
              <p className="font-medium">{listing.business_contact_name}</p>
              {listing.bc_phone && (
                <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{listing.bc_phone}</span>
                </p>
              )}
              {listing.bc_email && (
                <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span>{listing.bc_email}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
