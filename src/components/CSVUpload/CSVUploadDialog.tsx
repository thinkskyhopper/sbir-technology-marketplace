
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CSVUploadStep } from "./CSVUploadStep";
import { CSVPreviewStep } from "./CSVPreviewStep";
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
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  
  const { uploadListings, loading } = useCSVUpload();
  const { toast } = useToast();

  const handleFileParsed = (listings: ParsedListing[], selectedFile: File) => {
    setFile(selectedFile);
    setParsedData(listings);
    setStep('preview');
  };

  const handleErrors = (errors: string[]) => {
    // Errors are handled in the CSVUploadStep component
  };

  const handleUpload = async () => {
    if (!file || parsedData.length === 0) return;

    try {
      const result = await uploadListings(parsedData, file.name);
      
      if (result.successCount > 0) {
        toast({
          title: "Upload Complete!",
          description: `Successfully imported ${result.successCount} of ${result.successCount + result.failureCount} listings.`,
        });
      }

      if (result.failureCount > 0) {
        console.log('❌ Failed listings:', result.failedListings);
        toast({
          title: "Partial Upload",
          description: `${result.failureCount} listings failed. Check browser console for details.`,
          variant: "destructive",
        });
      }

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
    setStep('upload');
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('upload');
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
          <CSVUploadStep
            onFileParsed={handleFileParsed}
            onErrors={handleErrors}
          />
        )}

        {step === 'preview' && (
          <CSVPreviewStep
            listings={parsedData}
            onBack={handleBack}
            onUpload={handleUpload}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
