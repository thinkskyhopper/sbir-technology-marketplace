
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string | null) => void;
  disabled?: boolean;
}

const PhotoUpload = ({ currentPhotoUrl, onPhotoChange, disabled }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
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

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('listing-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-photos')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      setImageError(false);
      onPhotoChange(publicUrl);

      toast({
        title: "Photo uploaded",
        description: "The listing photo has been uploaded successfully.",
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
    setImageError(false);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast({
      title: "Photo removed",
      description: "The listing photo has been removed successfully.",
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="space-y-4">
      <Label>Listing Photo</Label>
      
      {previewUrl ? (
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="border rounded-lg overflow-hidden bg-muted">
            {!imageError ? (
              <img
                src={previewUrl}
                alt="Listing preview"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <Image className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Image failed to load</p>
                </div>
              </div>
            )}
          </AspectRatio>
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
        <AspectRatio ratio={16 / 9} className="border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-primary hover:text-primary/80">
                    Upload a photo
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
                PNG, JPG, GIF up to 5MB (16:9 aspect ratio recommended)
              </p>
            </div>
          </div>
        </AspectRatio>
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
          {isUploading ? "Uploading..." : "Choose Photo"}
        </Button>
      )}
    </div>
  );
};

export default PhotoUpload;
