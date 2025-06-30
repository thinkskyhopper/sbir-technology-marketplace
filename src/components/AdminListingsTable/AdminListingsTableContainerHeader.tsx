
import { useState } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import AdminListingsTableFilters from "./AdminListingsTableFilters";
import { ExportListingsDialog } from "./ExportListingsDialog";

interface AdminListingsTableContainerHeaderProps {
  totalItems: number;
  filteredCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  phaseFilter: string;
  setPhaseFilter: (phase: string) => void;
  agencyFilter: string;
  setAgencyFilter: (agency: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  uniqueAgencies: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  listings: any[];
}

const AdminListingsTableContainerHeader = ({
  totalItems,
  filteredCount,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  phaseFilter,
  setPhaseFilter,
  agencyFilter,
  setAgencyFilter,
  categoryFilter,
  setCategoryFilter,
  uniqueAgencies,
  onClearFilters,
  hasActiveFilters,
  listings,
}: AdminListingsTableContainerHeaderProps) => {
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All SBIR Listings</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {totalItems} total listings, {filteredCount} showing
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowExportDialog(true)}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
        <AdminListingsTableFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          phaseFilter={phaseFilter}
          setPhaseFilter={setPhaseFilter}
          agencyFilter={agencyFilter}
          setAgencyFilter={setAgencyFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          uniqueAgencies={uniqueAgencies}
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <ExportListingsDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        listings={listings}
        uniqueAgencies={uniqueAgencies}
      />
    </>
  );
};

export default AdminListingsTableContainerHeader;
