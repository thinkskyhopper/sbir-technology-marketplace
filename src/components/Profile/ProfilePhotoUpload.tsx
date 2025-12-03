import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { isAllowedImageExtension, validateImageMagicBytes } from "@/utils/imageValidation";
import { readFile } from "@/utils/imageResize";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import ImageCropper from "./ImageCropper";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string | null;
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  onPhotoChange: (url: string | null) => void;
  disabled?: boolean;
}

const ProfilePhotoUpload = ({ 
  currentPhotoUrl, 
  userId,
  userName,
  userEmail,
  onPhotoChange, 
  disabled 
}: ProfilePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // 1. Check extension allowlist
    if (!isAllowedImageExtension(file.name)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // 2. Check MIME type
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

    // 4. Check file size (max 5MB for original)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Read file and open cropper
    try {
      const imageSrc = await readFile(file);
      setSelectedImage(imageSrc);
      setCropperOpen(true);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error",
        description: "Failed to read the selected file.",
        variant: "destructive",
      });
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
    setSelectedImage(null);

    try {
      // Create filename with user ID for organization
      const fileName = `${userId}/${Date.now()}.jpg`;
      const filePath = fileName;

      // Convert blob to File for upload
      const file = new File([croppedBlob], 'profile-photo.jpg', { type: 'image/jpeg' });

      // Upload via edge function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'profile-photos');
      formData.append('filePath', filePath);

      const { data, error: uploadError } = await supabase.functions.invoke(
        'validate-and-upload-image',
        { body: formData }
      );

      if (uploadError) {
        throw uploadError;
      }

      if (!data?.publicUrl) {
        throw new Error('No public URL returned from upload');
      }

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      onPhotoChange(data.publicUrl);

      // Invalidate caches so other components show the new photo immediately
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });

      toast({
        title: "Photo uploaded",
        description: "Profile photo has been updated successfully.",
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
    if (!currentPhotoUrl) return;

    setIsUploading(true);

    try {
      // Update profile to remove photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: null })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Optionally delete from storage (extract path from URL)
      if (currentPhotoUrl.includes('profile-photos/')) {
        try {
          const urlParts = currentPhotoUrl.split('/profile-photos/');
          if (urlParts[1]) {
            const filePath = decodeURIComponent(urlParts[1]);
            await supabase.storage.from('profile-photos').remove([filePath]);
          }
        } catch (storageError) {
          console.error('Error removing file from storage:', storageError);
          // Continue anyway, the profile update succeeded
        }
      }

      onPhotoChange(null);

      // Invalidate caches so other components reflect the removal immediately
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });

      toast({
        title: "Photo removed",
        description: "Profile photo has been removed.",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <ProfileAvatar
          photoUrl={currentPhotoUrl}
          name={userName}
          email={userEmail}
          className="w-24 h-24"
          fallbackClassName="text-2xl"
        />
        
        {currentPhotoUrl && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full"
            onClick={handleRemovePhoto}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
          id="profile-photo-input"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <Camera className="h-4 w-4 mr-2" />
          {currentPhotoUrl ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG, WebP or GIF. Max 5MB.
      </p>

      {selectedImage && (
        <ImageCropper
          open={cropperOpen}
          onOpenChange={setCropperOpen}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
