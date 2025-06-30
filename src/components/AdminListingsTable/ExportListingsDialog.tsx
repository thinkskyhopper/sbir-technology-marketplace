
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/utils/categoryConstants";
import type { SBIRListing } from "@/types/listings";

interface ExportListingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listings: SBIRListing[];
  uniqueAgencies: string[];
}

interface ExportFilters {
  status: string;
  phase: string;
  agency: string;
  category: string;
  minValue: string;
  maxValue: string;
  dateFrom: string;
  dateTo: string;
  searchTerm: string;
}

interface ExportFields {
  title: boolean;
  description: boolean;
  agency: boolean;
  phase: boolean;
  value: boolean;
  deadline: boolean;
  category: boolean;
  status: boolean;
  submittedAt: boolean;
  userInfo: boolean;
  photoUrl: boolean;
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
    photoUrl: false
  });

  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  // Filter listings based on current filters
  const filteredListings = listings.filter(listing => {
    const matchesStatus = filters.status === "all" || listing.status === filters.status;
    const matchesPhase = filters.phase === "all" || listing.phase === filters.phase;
    const matchesAgency = filters.agency === "all" || listing.agency === filters.agency;
    const matchesCategory = filters.category === "all" || listing.category === filters.category;
    
    const matchesSearch = !filters.searchTerm || 
      listing.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      listing.agency.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesMinValue = !filters.minValue || listing.value >= parseFloat(filters.minValue);
    const matchesMaxValue = !filters.maxValue || listing.value <= parseFloat(filters.maxValue);

    const listingDate = new Date(listing.submitted_at);
    const matchesFromDate = !filters.dateFrom || listingDate >= new Date(filters.dateFrom);
    const matchesToDate = !filters.dateTo || listingDate <= new Date(filters.dateTo);

    return matchesStatus && matchesPhase && matchesAgency && matchesCategory && 
           matchesSearch && matchesMinValue && matchesMaxValue && 
           matchesFromDate && matchesToDate;
  });

  const handleExport = () => {
    if (filteredListings.length === 0) {
      toast({
        title: "No Data",
        description: "No listings match your current filters.",
        variant: "destructive"
      });
      return;
    }

    const exportData = filteredListings.map(listing => {
      const data: Record<string, any> = {};
      
      if (exportFields.title) data.title = listing.title;
      if (exportFields.description) data.description = listing.description;
      if (exportFields.agency) data.agency = listing.agency;
      if (exportFields.phase) data.phase = listing.phase;
      if (exportFields.value) data.value = listing.value;
      if (exportFields.deadline) data.deadline = listing.deadline;
      if (exportFields.category) data.category = listing.category;
      if (exportFields.status) data.status = listing.status;
      if (exportFields.submittedAt) data.submitted_at = listing.submitted_at;
      if (exportFields.userInfo && listing.profiles) {
        data.user_name = listing.profiles.full_name;
        data.user_email = listing.profiles.email;
      }
      if (exportFields.photoUrl) data.photo_url = listing.photo_url;

      return data;
    });

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

  const exportAsCSV = (data: Record<string, any>[]) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, 'sbir-listings-export.csv', 'text/csv');
  };

  const exportAsJSON = (data: Record<string, any>[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'sbir-listings-export.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectAllFields = (checked: boolean) => {
    setExportFields(prev => Object.keys(prev).reduce((acc, key) => {
      acc[key as keyof ExportFields] = checked;
      return acc;
    }, {} as ExportFields));
  };

  const selectedFieldsCount = Object.values(exportFields).filter(Boolean).length;

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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Hidden">Hidden</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phase">Phase</Label>
                <Select value={filters.phase} onValueChange={(value) => setFilters(prev => ({ ...prev, phase: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    <SelectItem value="Phase I">Phase I</SelectItem>
                    <SelectItem value="Phase II">Phase II</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="agency">Agency</Label>
                <Select value={filters.agency} onValueChange={(value) => setFilters(prev => ({ ...prev, agency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agencies</SelectItem>
                    {uniqueAgencies.map(agency => (
                      <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="search">Search Terms</Label>
              <Input
                id="search"
                placeholder="Search by title, agency, or category..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="minValue">Min Value ($)</Label>
                <Input
                  id="minValue"
                  type="number"
                  placeholder="0"
                  value={filters.minValue}
                  onChange={(e) => setFilters(prev => ({ ...prev, minValue: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="maxValue">Max Value ($)</Label>
                <Input
                  id="maxValue"
                  type="number"
                  placeholder="1000000"
                  value={filters.maxValue}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxValue: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>{filteredListings.length}</strong> of <strong>{listings.length}</strong> listings match your filters
            </div>
          </div>

          {/* Export Options Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Export Options</h3>
            
            <div>
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: "csv" | "json") => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                  <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Fields to Export</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedFieldsCount === Object.keys(exportFields).length}
                    onCheckedChange={handleSelectAllFields}
                  />
                  <Label htmlFor="select-all" className="text-sm">Select All</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="title"
                    checked={exportFields.title}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, title: !!checked }))}
                  />
                  <Label htmlFor="title">Title</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="description"
                    checked={exportFields.description}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, description: !!checked }))}
                  />
                  <Label htmlFor="description">Description</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agency"
                    checked={exportFields.agency}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, agency: !!checked }))}
                  />
                  <Label htmlFor="agency">Agency</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="phase"
                    checked={exportFields.phase}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, phase: !!checked }))}
                  />
                  <Label htmlFor="phase">Phase</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="value"
                    checked={exportFields.value}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, value: !!checked }))}
                  />
                  <Label htmlFor="value">Value</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="deadline"
                    checked={exportFields.deadline}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, deadline: !!checked }))}
                  />
                  <Label htmlFor="deadline">Deadline</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="category"
                    checked={exportFields.category}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, category: !!checked }))}
                  />
                  <Label htmlFor="category">Category</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status"
                    checked={exportFields.status}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, status: !!checked }))}
                  />
                  <Label htmlFor="status">Status</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="submittedAt"
                    checked={exportFields.submittedAt}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, submittedAt: !!checked }))}
                  />
                  <Label htmlFor="submittedAt">Submitted Date</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="userInfo"
                    checked={exportFields.userInfo}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, userInfo: !!checked }))}
                  />
                  <Label htmlFor="userInfo">User Info</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="photoUrl"
                    checked={exportFields.photoUrl}
                    onCheckedChange={(checked) => setExportFields(prev => ({ ...prev, photoUrl: !!checked }))}
                  />
                  <Label htmlFor="photoUrl">Photo URL</Label>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                {selectedFieldsCount} of {Object.keys(exportFields).length} fields selected
              </div>
            </div>
          </div>
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
