
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ParsedListing } from "./types";

interface CSVPreviewTableProps {
  listings: ParsedListing[];
}

export const CSVPreviewTable = ({ listings }: CSVPreviewTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Agency</TableHead>
          <TableHead>Phase</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Topic Code</TableHead>
          <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium max-w-[200px]">
                <div className="truncate" title={listing.title}>
                  {listing.title}
                </div>
              </TableCell>
              <TableCell>{listing.agency}</TableCell>
              <TableCell>
                <Badge variant="outline">{listing.phase}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(listing.value)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{listing.category}</Badge>
              </TableCell>
              <TableCell>{listing.company || '-'}</TableCell>
              <TableCell>{listing.topic_code || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  {listing.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
