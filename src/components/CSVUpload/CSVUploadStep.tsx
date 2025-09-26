
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseCSV } from "@/utils/csvParser";
import type { ParsedListing } from "./types";

interface CSVUploadStepProps {
  onFileParsed: (listings: ParsedListing[], file: File) => void;
  onErrors: (errors: string[]) => void;
}

export const CSVUploadStep = ({ onFileParsed, onErrors }: CSVUploadStepProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSVFile(selectedFile);
    }
  };

  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      console.log('📄 Raw CSV content preview:', text.substring(0, 200));
      
      const { headers, rows, errors: parseErrors } = parseCSV(text);
      
      if (parseErrors.length > 0) {
        console.error('❌ CSV parsing errors:', parseErrors);
        setErrors(parseErrors);
        onErrors(parseErrors);
        return;
      }

      console.log('📊 Parsed CSV headers:', headers);
      console.log('📊 Number of data rows:', rows.length);

      // Validate required headers
      const requiredHeaders = ['title', 'description', 'agency', 'phase', 'value', 'category'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        const errorMsg = [`Missing required headers: ${missingHeaders.join(', ')}`];
        console.error('❌ Missing headers:', missingHeaders);
        setErrors(errorMsg);
        onErrors(errorMsg);
        return;
      }

      const parsed: ParsedListing[] = [];
      const validationErrors: string[] = [];

      // Create header index map for efficient lookup
      const headerIndexMap = headers.reduce((acc, header, index) => {
        acc[header] = index;
        return acc;
      }, {} as Record<string, number>);

      console.log('🗺️ Header index map:', headerIndexMap);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +2 because array is 0-indexed and we skip header row
        
        console.log(`📝 Processing row ${rowNumber}:`, row);

        // Skip empty rows
        if (row.every(cell => !cell.trim())) {
          console.log(`⏭️ Skipping empty row ${rowNumber}`);
          continue;
        }

        const listing: ParsedListing = {
          title: row[headerIndexMap['title']] || '',
          description: row[headerIndexMap['description']] || '',
          agency: row[headerIndexMap['agency']] || '',
          phase: row[headerIndexMap['phase']] as 'Phase I' | 'Phase II',
          value: parseFloat(row[headerIndexMap['value']] || '0'),
          deadline: row[headerIndexMap['deadline']] || '',
          category: row[headerIndexMap['category']] || '',
          photo_url: row[headerIndexMap['photo_url']] || '',
          status: 'Pending',
          rowNumber,
          // Optional fields - only include if present in CSV
          technology_summary: row[headerIndexMap['technology_summary']] || undefined,
          internal_title: row[headerIndexMap['internal_title']] || undefined,
          internal_description: row[headerIndexMap['internal_description']] || undefined,
          agency_tracking_number: row[headerIndexMap['agency_tracking_number']] || undefined,
          contract: row[headerIndexMap['contract']] || undefined,
          proposal_award_date: row[headerIndexMap['proposal_award_date']] || undefined,
          contract_end_date: row[headerIndexMap['contract_end_date']] || undefined,
          topic_code: row[headerIndexMap['topic_code']] || undefined,
          company: row[headerIndexMap['company']] || undefined,
          address: row[headerIndexMap['address']] || undefined,
          primary_investigator_name: row[headerIndexMap['primary_investigator_name']] || undefined,
          pi_phone: row[headerIndexMap['pi_phone']] || undefined,
          pi_email: row[headerIndexMap['pi_email']] || undefined,
          business_contact_name: row[headerIndexMap['business_contact_name']] || undefined,
          bc_phone: row[headerIndexMap['bc_phone']] || undefined,
          bc_email: row[headerIndexMap['bc_email']] || undefined,
        };

        // Comprehensive validation
        if (!listing.title.trim()) {
          validationErrors.push(`Row ${rowNumber}: Title is required`);
        }
        if (!listing.description.trim()) {
          validationErrors.push(`Row ${rowNumber}: Description is required`);
        }
        if (!listing.agency.trim()) {
          validationErrors.push(`Row ${rowNumber}: Agency is required`);
        }
        if (!['Phase I', 'Phase II'].includes(listing.phase)) {
          validationErrors.push(`Row ${rowNumber}: Phase must be "Phase I" or "Phase II", got "${listing.phase}"`);
        }
        if (isNaN(listing.value) || listing.value <= 0) {
          validationErrors.push(`Row ${rowNumber}: Value must be a positive number, got "${row[headerIndexMap['value']]}"`);
        }
        if (!listing.category.trim()) {
          validationErrors.push(`Row ${rowNumber}: Category is required`);
        }

        parsed.push(listing);
      }

      console.log('✅ Successfully parsed listings:', parsed.length);
      console.log('⚠️ Validation errors:', validationErrors.length);

      setErrors(validationErrors);
      onErrors(validationErrors);
      
      if (validationErrors.length === 0) {
        onFileParsed(parsed, file);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="csv-file">Select CSV File</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv,.tsv"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">
          <strong>Required columns:</strong> title, description, agency, phase, value, category
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Optional columns:</strong> deadline, photo_url, technology_summary, internal_title, internal_description, agency_tracking_number, contract, proposal_award_date, contract_end_date, topic_code, company, address, primary_investigator_name, pi_phone, pi_email, business_contact_name, bc_phone, bc_email
        </p>
        <p className="text-xs text-muted-foreground">
          Supports CSV (comma-separated) and TSV (tab-separated) files. Multi-line fields are supported. Missing trailing columns will be auto-filled. Dates should be in YYYY-MM-DD format.
        </p>
      </div>

      {file && (
        <Alert>
          <FileText className="w-4 h-4" />
          <AlertDescription>
            Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </AlertDescription>
        </Alert>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Issues found in CSV:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.slice(0, 10).map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
              {errors.length > 10 && (
                <p className="text-sm">... and {errors.length - 10} more issues</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
