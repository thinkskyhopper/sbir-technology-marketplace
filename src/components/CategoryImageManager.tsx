
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

const SUGGESTED_RESOLUTION = "2000x800px (5:2 aspect ratio)";

// Use the same image selection logic as the listings
const getCategoryImageUrl = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  // Check Advanced Materials first to avoid conflicts with other material-related terms
  if (categoryLower.includes('advanced materials') || (categoryLower.includes('advanced') && categoryLower.includes('materials'))) {
    // Use a different working image for Advanced Materials
    return "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('cyber') || categoryLower.includes('security')) {
    return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('autonomous')) {
    return "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('biomedical') || categoryLower.includes('medical')) {
    return "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('quantum')) {
    return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('space')) {
    return "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('software') || categoryLower.includes('ai') || categoryLower.includes('data')) {
    return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('hardware') || categoryLower.includes('electronic')) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else {
    return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  }
};

const CategoryImageManager = () => {
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
  const { toast } = useToast();

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
          {CATEGORIES.map((category) => {
            const imageUrl = getCategoryImageUrl(category);
            
            return (
              <div key={category} className="space-y-3">
                <div className="aspect-[5/2] border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryImageManager;
