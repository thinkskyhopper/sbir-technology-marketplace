
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAllowedImageExtension, validateImageMagicBytes } from "@/utils/imageValidation";

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string | null) => void;
  disabled?: boolean;
}

const PhotoUpload = ({ currentPhotoUrl, onPhotoChange, disabled }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Check extension allowlist
    if (!isAllowedImageExtension(file.name)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // 2. Check MIME type (basic check)
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // 3. Validate magic bytes
    if (!await validateImageMagicBytes(file)) {
      toast({
        title: "Invalid image",
        description: "The file does not appear to be a valid image.",
        variant: "destructive",
      });
      return;
    }

    // 4. Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `listing-photos/${fileName}`;

      // Upload via edge function with server-side validation
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'listing-photos');
      formData.append('filePath', filePath);

      const { data, error: uploadError } = await supabase.functions.invoke(
        'validate-and-upload-image',
        {
          body: formData,
        }
      );

      if (uploadError) {
        throw uploadError;
      }

      if (!data?.publicUrl) {
        throw new Error('No public URL returned from upload');
      }

      setPreviewUrl(data.publicUrl);
      onPhotoChange(data.publicUrl);

      toast({
        title: "Photo uploaded",
        description: "The custom listing photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (currentPhotoUrl && currentPhotoUrl.includes('listing-photos/')) {
      try {
        // Extract file path from URL
        const urlParts = currentPhotoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `listing-photos/${fileName}`;

        // Delete from storage
        const { error } = await supabase.storage
          .from('listing-photos')
          .remove([filePath]);

        if (error) {
          console.error('Error deleting photo:', error);
        }
      } catch (error) {
        console.error('Error removing photo:', error);
      }
    }

    setPreviewUrl(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast({
      title: "Photo removed",
      description: "The custom photo has been removed. The listing will now use the default category image.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Custom Listing Photo</Label>
        {previewUrl && (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            Custom Image
          </Badge>
        )}
      </div>
      
      {previewUrl ? (
        <div className="relative">
          <div className="relative w-full max-h-48 border rounded-lg overflow-hidden bg-muted">
            <img
              src={previewUrl}
              alt="Listing preview"
              className="w-full max-h-48 object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemovePhoto}
            disabled={disabled || isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <Image className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-primary hover:text-primary/80">
                  Upload a custom photo
                </span>
                <Input
                  id="photo-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={disabled || isUploading}
                  className="sr-only"
                />
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG, GIF up to 5MB
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If no custom photo is uploaded, the default category image will be used
            </p>
          </div>
        </div>
      )}

      {!previewUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Choose Custom Photo"}
        </Button>
      )}
    </div>
  );
};

export default PhotoUpload;
