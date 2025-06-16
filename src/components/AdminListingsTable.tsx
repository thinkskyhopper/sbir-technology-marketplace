
import { useState } from "react";
import { useListings } from "@/hooks/useListings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Eye, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const AdminListingsTable = () => {
  const { listings, loading, error, approveListing, rejectListing } = useListings();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (listingId: string) => {
    try {
      setProcessingId(listingId);
      await approveListing(listingId);
      toast({
        title: "Listing Approved",
        description: "The listing has been successfully approved and is now active.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (listingId: string) => {
    try {
      setProcessingId(listingId);
      await rejectListing(listingId);
      toast({
        title: "Listing Rejected",
        description: "The listing has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      case 'Sold':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading listings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading listings: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All SBIR Listings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="max-w-xs">
                  <div>
                    <div className="font-medium truncate">{listing.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {listing.category}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{listing.agency}</TableCell>
                <TableCell>
                  <Badge variant={listing.phase === "Phase I" ? "default" : "secondary"}>
                    {listing.phase}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(listing.value)}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(listing.deadline)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(listing.status)}>
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(listing.submitted_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {listing.status === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(listing.id)}
                          disabled={processingId === listing.id}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(listing.id)}
                          disabled={processingId === listing.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {listings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No listings found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminListingsTable;
