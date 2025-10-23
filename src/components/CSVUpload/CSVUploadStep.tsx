
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseCSV } from "@/utils/csvParser";
import type { ParsedListing } from "./types";

interface CSVUploadStepProps {
  onFileParsed: (listings: ParsedListing[], file: File) => void;
  onErrors: (errors: string[]) => void;
}

type Encoding = 'UTF-8' | 'Windows-1252' | 'ISO-8859-1';

export const CSVUploadStep = ({ onFileParsed, onErrors }: CSVUploadStepProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedEncoding, setSelectedEncoding] = useState<Encoding>('UTF-8');
  const [detectedEncoding, setDetectedEncoding] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDetectedEncoding(null);
      parseCSVFileWithEncoding(selectedFile, selectedEncoding);
    }
  };

  const handleEncodingChange = (encoding: Encoding) => {
    setSelectedEncoding(encoding);
    if (file) {
      parseCSVFileWithEncoding(file, encoding);
    }
  };

  const hasCorruptedChars = (text: string): boolean => {
    return text.includes('�') || /[\uFFFD]/.test(text);
  };

  const parseCSVFileWithEncoding = async (file: File, encoding: Encoding) => {
    console.log(`🔤 Attempting to read file with encoding: ${encoding}`);
    
    try {
      const text = await readFileWithEncoding(file, encoding);
      console.log('📄 Raw CSV content preview:', text.substring(0, 200));
      
      // Check for corrupted characters
      if (hasCorruptedChars(text) && encoding === 'UTF-8') {
        console.log('⚠️ Detected corrupted characters, trying Windows-1252 encoding');
        setDetectedEncoding('Detected character encoding issues - automatically trying Windows-1252');
        return parseCSVFileWithEncoding(file, 'Windows-1252');
      }
      
      if (hasCorruptedChars(text) && encoding === 'Windows-1252') {
        console.log('⚠️ Still corrupted with Windows-1252, trying ISO-8859-1 encoding');
        setDetectedEncoding('Still detecting issues - automatically trying ISO-8859-1');
        return parseCSVFileWithEncoding(file, 'ISO-8859-1');
      }
      
      if (encoding !== 'UTF-8') {
        setDetectedEncoding(`Successfully read file using ${encoding} encoding`);
      }
      
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
        const rowNumber = i + 2;
        
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
    } catch (error) {
      console.error('❌ Failed to read file:', error);
      const errorMsg = ['Failed to read file. Please check the file format and encoding.'];
      setErrors(errorMsg);
      onErrors(errorMsg);
    }
  };

  const readFileWithEncoding = (file: File, encoding: Encoding): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(reader.error);
      
      // Use the specified encoding
      reader.readAsText(file, encoding);
    });
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
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor="encoding-select" className="text-sm">Character Encoding</Label>
            <Select value={selectedEncoding} onValueChange={handleEncodingChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select encoding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTF-8">UTF-8</SelectItem>
                <SelectItem value="Windows-1252">Windows-1252</SelectItem>
                <SelectItem value="ISO-8859-1">ISO-8859-1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          <strong>Required columns:</strong> title, description, agency, phase, value, category
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Optional columns:</strong> deadline, photo_url, technology_summary, agency_tracking_number, contract, proposal_award_date, contract_end_date, topic_code, company, address, primary_investigator_name, pi_phone, pi_email, business_contact_name, bc_phone, bc_email
        </p>
        <p className="text-xs text-muted-foreground">
          Supports CSV (comma-separated) and TSV (tab-separated) files. Multi-line fields are supported. Missing trailing columns will be auto-filled. Dates should be in YYYY-MM-DD format.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Encoding help:</strong> Use UTF-8 for most modern files, Windows-1252 for Excel exports with special characters (•, –, —), or ISO-8859-1 as fallback.
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

      {detectedEncoding && (
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            {detectedEncoding}
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
