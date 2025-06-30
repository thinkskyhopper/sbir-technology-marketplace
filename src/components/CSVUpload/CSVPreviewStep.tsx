
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CSVPreviewTable } from "./CSVPreviewTable";
import type { ParsedListing } from "./types";

interface CSVPreviewStepProps {
  listings: ParsedListing[];
  onBack: () => void;
  onUpload: () => void;
  loading: boolean;
}

export const CSVPreviewStep = ({ listings, onBack, onUpload, loading }: CSVPreviewStepProps) => {
  return (
    <div className="space-y-4">
      <Alert>
        <CheckCircle className="w-4 h-4" />
        <AlertDescription>
          Ready to import {listings.length} listings. All listings will be created with "Pending" status.
        </AlertDescription>
      </Alert>

      <CSVPreviewTable listings={listings} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Upload
        </Button>
        <Button onClick={onUpload} disabled={loading}>
          {loading ? 'Uploading...' : `Import ${listings.length} Listings`}
        </Button>
      </div>
    </div>
  );
};
