
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { SBIRListing } from "@/types/listings";

interface BasicInformationCardProps {
  listing: SBIRListing;
}

export const BasicInformationCard = ({ listing }: BasicInformationCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatCurrency = (amount: number): string => {
    // Values are already in dollars from the query services
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Sold': return 'sold';
      case 'Rejected': return 'destructive';
      case 'Hidden': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClassName = (status: string) => {
    if (status === 'Active') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Basic Information
          <Badge 
            variant={getStatusBadgeVariant(listing.status)}
            className={`text-xs ${getStatusBadgeClassName(listing.status)}`}
          >
            {listing.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
          <p className="text-muted-foreground">{listing.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Agency</p>
              <p className="font-medium">{listing.agency}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Value</p>
              <p className="font-medium">{formatCurrency(listing.value)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Sale Price</p>
              <p className="font-medium">{formatCurrency(listing.value)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Phase</p>
            <p className="font-medium">{listing.phase}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Category</p>
          <p className="font-medium">{listing.category}</p>
        </div>
        
        {listing.technology_summary && (
          <div>
            <p className="text-sm text-muted-foreground">Technology Summary</p>
            <p className="font-medium">{listing.technology_summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
