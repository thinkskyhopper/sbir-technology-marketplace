
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SBIRListing } from "@/types/listings";
import { ExportFiltersSection } from "./ExportListingsDialog/ExportFiltersSection";
import { ExportOptionsSection } from "./ExportListingsDialog/ExportOptionsSection";
import { useExportFiltering } from "./ExportListingsDialog/useExportFiltering";
import { prepareExportData, exportAsCSV, exportAsJSON } from "./ExportListingsDialog/exportUtils";
import type { ExportFilters, ExportFields } from "./ExportListingsDialog/types";

interface ExportListingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listings: SBIRListing[];
  uniqueAgencies: string[];
}

export const ExportListingsDialog = ({ 
  open, 
  onOpenChange, 
  listings,
  uniqueAgencies 
}: ExportListingsDialogProps) => {
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<ExportFilters>({
    status: "all",
    phase: "all",
    agency: "all",
    category: "all",
    minValue: "",
    maxValue: "",
    dateFrom: "",
    dateTo: "",
    searchTerm: ""
  });

  const [exportFields, setExportFields] = useState<ExportFields>({
    title: true,
    description: true,
    agency: true,
    phase: true,
    value: true,
    deadline: true,
    category: true,
    status: true,
    submittedAt: true,
    userInfo: false,
    photoUrl: false,
    dateSold: false
  });

  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const filteredListings = useExportFiltering(listings, filters);
  const selectedFieldsCount = Object.values(exportFields).filter(Boolean).length;

  const handleExport = () => {
    if (filteredListings.length === 0) {
      toast({
        title: "No Data",
        description: "No listings match your current filters.",
        variant: "destructive"
      });
      return;
    }

    const exportData = prepareExportData(filteredListings, exportFields);

    if (exportFormat === "csv") {
      exportAsCSV(exportData);
    } else {
      exportAsJSON(exportData);
    }

    toast({
      title: "Export Complete",
      description: `Successfully exported ${filteredListings.length} listings as ${exportFormat.toUpperCase()}.`
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Listings
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Filters Section */}
          <ExportFiltersSection
            filters={filters}
            setFilters={setFilters}
            listings={listings}
            uniqueAgencies={uniqueAgencies}
            filteredListings={filteredListings}
          />

          {/* Export Options Section */}
          <ExportOptionsSection
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            exportFields={exportFields}
            setExportFields={setExportFields}
          />
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={filteredListings.length === 0 || selectedFieldsCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export {filteredListings.length} Listings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
