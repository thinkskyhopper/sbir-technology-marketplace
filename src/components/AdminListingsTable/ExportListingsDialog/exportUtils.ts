
import { format } from "date-fns";
import type { SBIRListing } from "@/types/listings";
import type { ExportFields } from "./types";

export const prepareExportData = (listings: SBIRListing[], exportFields: ExportFields) => {
  return listings.map(listing => {
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
    if (exportFields.dateSold) {
      data.date_sold = listing.date_sold ? format(new Date(listing.date_sold), 'MMM d, yyyy') : '';
    }

    return data;
  });
};

export const exportAsCSV = (data: Record<string, any>[]) => {
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

export const exportAsJSON = (data: Record<string, any>[]) => {
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
