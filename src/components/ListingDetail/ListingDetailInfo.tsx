
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ListingDetailInfoProps {
  listing: {
    phase: string;
    category: string;
    agency: string;
    value: number;
  };
}

const ListingDetailInfo = ({ listing }: ListingDetailInfoProps) => {
  // This component is no longer needed as we're removing the Technology Details section
  // The information will be moved to the sidebar
  return null;
};

export default ListingDetailInfo;
