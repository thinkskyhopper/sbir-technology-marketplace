
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CSVPreviewTable } from "./CSVPreviewTable";
import { useCSVUpload } from "./useCSVUpload";
import type { ParsedListing } from "./types";

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CSVUploadDialog = ({ open, onOpenChange, onSuccess }: CSVUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedListing[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  
  const { uploadListings, loading } = useCSVUpload();
  const { toast } = useToast();

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
        setErrors(['CSV file must contain at least a header row and one data row']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['title', 'description', 'agency', 'phase', 'value', 'deadline', 'category'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        setErrors([`Missing required headers: ${missingHeaders.join(', ')}`]);
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
      setParsedData(parsed);
      
      if (parseErrors.length === 0) {
        setStep('preview');
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file || parsedData.length === 0) return;

    try {
      const result = await uploadListings(parsedData, file.name);
      
      toast({
        title: "Success!",
        description: `Successfully imported ${result.successCount} listings. ${result.failureCount} failed.`,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload listings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setStep('upload');
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('upload');
    setErrors([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {step === 'upload' ? 'Upload CSV File' : 'Preview Listings'}
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
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
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Ready to import {parsedData.length} listings. All listings will be created with "Pending" status.
              </AlertDescription>
            </Alert>

            <CSVPreviewTable listings={parsedData} />

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back to Upload
              </Button>
              <Button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : `Import ${parsedData.length} Listings`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
