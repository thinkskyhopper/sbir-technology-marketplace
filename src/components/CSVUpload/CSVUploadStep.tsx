
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        const errorMsg = ['CSV file must contain at least a header row and one data row'];
        setErrors(errorMsg);
        onErrors(errorMsg);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['title', 'description', 'agency', 'phase', 'value', 'deadline', 'category'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        const errorMsg = [`Missing required headers: ${missingHeaders.join(', ')}`];
        setErrors(errorMsg);
        onErrors(errorMsg);
        return;
      }

      const parsed: ParsedListing[] = [];
      const parseErrors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
        
        if (row.length !== headers.length) {
          parseErrors.push(`Row ${i + 1}: Incorrect number of columns`);
          continue;
        }

        const listing: ParsedListing = {
          title: row[headers.indexOf('title')] || '',
          description: row[headers.indexOf('description')] || '',
          agency: row[headers.indexOf('agency')] || '',
          phase: row[headers.indexOf('phase')] as 'Phase I' | 'Phase II',
          value: parseFloat(row[headers.indexOf('value')] || '0'),
          deadline: row[headers.indexOf('deadline')] || '',
          category: row[headers.indexOf('category')] || '',
          photo_url: row[headers.indexOf('photo_url')] || '',
          status: 'Pending',
          rowNumber: i + 1
        };

        // Basic validation
        if (!listing.title) parseErrors.push(`Row ${i + 1}: Title is required`);
        if (!listing.description) parseErrors.push(`Row ${i + 1}: Description is required`);
        if (!listing.agency) parseErrors.push(`Row ${i + 1}: Agency is required`);
        if (!['Phase I', 'Phase II'].includes(listing.phase)) parseErrors.push(`Row ${i + 1}: Phase must be "Phase I" or "Phase II"`);
        if (isNaN(listing.value) || listing.value <= 0) parseErrors.push(`Row ${i + 1}: Value must be a positive number`);
        if (!listing.deadline) parseErrors.push(`Row ${i + 1}: Deadline is required`);
        if (!listing.category) parseErrors.push(`Row ${i + 1}: Category is required`);

        parsed.push(listing);
      }

      setErrors(parseErrors);
      onErrors(parseErrors);
      
      if (parseErrors.length === 0) {
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
              <p className="font-medium">Errors found in CSV:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.slice(0, 10).map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
              {errors.length > 10 && (
                <p className="text-sm">... and {errors.length - 10} more errors</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
