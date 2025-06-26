
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface AdminListingsTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  phaseFilter: string;
  setPhaseFilter: (phase: string) => void;
  agencyFilter: string;
  setAgencyFilter: (agency: string) => void;
  uniqueAgencies: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const AdminListingsTableFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  phaseFilter,
  setPhaseFilter,
  agencyFilter,
  setAgencyFilter,
  uniqueAgencies,
  onClearFilters,
  hasActiveFilters,
}: AdminListingsTableFiltersProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-64"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
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
      <Select value={phaseFilter} onValueChange={setPhaseFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Phase" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Phases</SelectItem>
          <SelectItem value="Phase I">Phase I</SelectItem>
          <SelectItem value="Phase II">Phase II</SelectItem>
        </SelectContent>
      </Select>
      <Select value={agencyFilter} onValueChange={setAgencyFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Agency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Agencies</SelectItem>
          {uniqueAgencies.map(agency => (
            <SelectItem key={agency} value={agency}>{agency}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default AdminListingsTableFilters;
