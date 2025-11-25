import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Building, Clock, Tag, Settings, FileText } from "lucide-react";

interface ListingDetailKeyInfoProps {
  listing: {
    deadline?: string;
    value: number;
    agency: string;
    submitted_at: string;
    approved_at?: string | null;
    category: string;
    phase: string;
    listing_type: string;
  };
}

const ListingDetailKeyInfo = ({ listing }: ListingDetailKeyInfoProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
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
          <FileText className="w-4 h-4 mr-2 text-indigo-500" />
          <div>
            <p className="font-semibold">Type</p>
            <p className="text-muted-foreground">{listing.listing_type}</p>
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
  );
};

export default ListingDetailKeyInfo;
