
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
      const requiredHeaders = ['title', 'description', 'agency', 'phase', 'value', 'deadline', 'category'];
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
          rowNumber
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
        if (!listing.deadline.trim()) {
          validationErrors.push(`Row ${rowNumber}: Deadline is required`);
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
          accept=".csv"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">
          CSV must include columns: title, description, agency, phase, value, deadline, category
        </p>
        <p className="text-xs text-muted-foreground">
          Note: Fields containing commas should be enclosed in double quotes (e.g., "Agency Name, LLC")
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
