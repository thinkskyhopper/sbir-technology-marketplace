
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

    onUploadStart(category);

    try {
      // Create a unique filename for the category
      const fileExt = file.name.split('.').pop();
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      const fileName = `category-${categorySlug}.${fileExt}`;
      const filePath = `category-images/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

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
    <div className="flex items-center space-x-2">
      <Label htmlFor={`upload-${category}`} className="cursor-pointer">
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
    </div>
  );
};

export default CategoryImageUpload;
