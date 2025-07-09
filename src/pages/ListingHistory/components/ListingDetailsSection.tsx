
import type { SBIRListing } from "@/types/listings";
import { BasicInformationCard } from "./BasicInformationCard";
import { AdministrativeDetailsCard } from "./AdministrativeDetailsCard";
import { ContactInformationCard } from "./ContactInformationCard";

interface ListingDetailsSectionProps {
  listing: SBIRListing;
}

export const ListingDetailsSection = ({ listing }: ListingDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <BasicInformationCard listing={listing} />
      <AdministrativeDetailsCard listing={listing} />
      <ContactInformationCard listing={listing} />
    </div>
  );
};
