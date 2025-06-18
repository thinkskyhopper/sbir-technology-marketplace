
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Building, Mail } from "lucide-react";

interface ListingDetailSidebarProps {
  listing: {
    deadline: string;
    value: number;
    agency: string;
    submitted_at: string;
  };
  onContactAdmin: () => void;
}

const ListingDetailSidebar = ({ listing, onContactAdmin }: ListingDetailSidebarProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Key Information */}
      <Card>
        <CardHeader>
          <CardTitle>Key Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-red-500" />
            <div>
              <p className="font-semibold">Deadline</p>
              <p className="text-muted-foreground">{formatDate(listing.deadline)}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
            <div>
              <p className="font-semibold">Project Value</p>
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
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Interested?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Contact our team to learn more about this opportunity and discuss the acquisition process.
          </p>
          
          <Button 
            className="w-full"
            onClick={onContactAdmin}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>• Verified opportunity details</p>
            <p>• Expert guidance included</p>
            <p>• Secure transaction process</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Listed</span>
              <span>{formatDate(listing.submitted_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deadline</span>
              <span className="font-semibold text-red-600">{formatDate(listing.deadline)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingDetailSidebar;
