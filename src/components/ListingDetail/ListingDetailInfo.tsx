
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-1">Phase</h4>
            <p className="text-muted-foreground">{listing.phase}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Category</h4>
            <p className="text-muted-foreground">{listing.category}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Agency</h4>
            <p className="text-muted-foreground">{listing.agency}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Contract Value</h4>
            <p className="text-muted-foreground font-semibold">{formatCurrency(listing.value)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingDetailInfo;
