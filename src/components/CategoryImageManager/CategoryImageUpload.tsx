
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAllowedImageExtension, validateImageMagicBytes } from "@/utils/imageValidation";

interface CategoryImageUploadProps {
  category: string;
  isUploading: boolean;
  onUploadStart: (category: string) => void;
  onUploadEnd: () => void;
}

const CategoryImageUpload = ({ 
  category, 
  isUploading, 
  onUploadStart, 
  onUploadEnd 
}: CategoryImageUploadProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    onUploadStart(category);

    try {
      // Create a unique filename for the category
      const fileExt = file.name.split('.').pop();
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      const fileName = `category-${categorySlug}.${fileExt}`;

      console.log('Uploading file via validation function:', fileName, 'to bucket: category-images');

      // First, try to remove any existing file with different extensions
      const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      for (const ext of possibleExtensions) {
        const oldFileName = `category-${categorySlug}.${ext}`;
        if (oldFileName !== fileName) {
          await supabase.storage
            .from('category-images')
            .remove([oldFileName]);
        }
      }

      // Upload via edge function with server-side validation
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'category-images');
      formData.append('filePath', fileName);

      const { data, error: uploadError } = await supabase.functions.invoke(
        'validate-and-upload-image',
        {
          body: formData,
        }
      );

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      if (!data?.publicUrl) {
        throw new Error('No public URL returned from upload');
      }

      console.log('File uploaded successfully via edge function:', data.publicUrl);

      toast({
        title: "Image uploaded",
        description: `The ${category} category image has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error uploading category image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload category image. Please try again.",
        variant: "destructive",
      });
    } finally {
      onUploadEnd();
    }
  };

  return (
    <Label htmlFor={`upload-${category}`} className="cursor-pointer flex-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        className="w-full"
        asChild
      >
        <span>
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload"}
        </span>
      </Button>
      <Input
        id={`upload-${category}`}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading}
        className="sr-only"
      />
    </Label>
  );
};

export default CategoryImageUpload;
