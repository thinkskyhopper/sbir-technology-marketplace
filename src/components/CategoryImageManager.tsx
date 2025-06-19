
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Advanced Materials",
  "Autonomous Systems", 
  "Biomedical Technology",
  "Cybersecurity",
  "Quantum Technology",
  "Space Technology",
  "Other"
];

const SUGGESTED_RESOLUTION = "400x300px (4:3 aspect ratio)";

const CategoryImageManager = () => {
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const getCategoryImageUrl = (category: string) => {
    // Convert category name to a URL-friendly format for placeholder images
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    return `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center&q=80`;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
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

    setUploadingCategory(category);

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
      setUploadingCategory(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <div key={category} className="space-y-3">
              <div className="aspect-[4/3] border rounded-lg overflow-hidden bg-muted">
                <img
                  src={getCategoryImageUrl(category)}
                  alt={`${category} category`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">{category}</Label>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`upload-${category}`} className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingCategory === category}
                      className="w-full"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingCategory === category ? "Uploading..." : "Upload"}
                      </span>
                    </Button>
                    <Input
                      id={`upload-${category}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, category)}
                      disabled={uploadingCategory === category}
                      className="sr-only"
                    />
                  </Label>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Suggested: {SUGGESTED_RESOLUTION}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryImageManager;
