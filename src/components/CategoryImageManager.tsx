
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image, AlertCircle } from "lucide-react";
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
  
  console.log('Category for image selection:', category, 'Lowercase:', categoryLower);
  
  // Check Advanced Materials first to avoid conflicts with other material-related terms
  if (categoryLower.includes('advanced materials') || (categoryLower.includes('advanced') && categoryLower.includes('materials'))) {
    console.log('Matched Advanced Materials category');
    // Use a different working image for Advanced Materials
    return "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('cyber') || categoryLower.includes('security')) {
    console.log('Matched Cybersecurity category');
    return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('autonomous')) {
    console.log('Matched Autonomous Systems category');
    return "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('biomedical') || categoryLower.includes('medical')) {
    console.log('Matched Biomedical category');
    return "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('quantum')) {
    console.log('Matched Quantum category');
    return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('space')) {
    console.log('Matched Space category');
    return "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('software') || categoryLower.includes('ai') || categoryLower.includes('data')) {
    console.log('Matched Software/AI category');
    return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else if (categoryLower.includes('hardware') || categoryLower.includes('electronic')) {
    console.log('Matched Hardware category');
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  } else {
    console.log('Using default image for category:', categoryLower);
    return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  }
};

const CategoryImageManager = () => {
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const [imageLoadSuccess, setImageLoadSuccess] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleImageLoad = (category: string) => {
    console.log(`✅ Image loaded successfully for ${category}`);
    setImageLoadSuccess(prev => new Set([...prev, category]));
    setImageLoadErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(category);
      return newSet;
    });
  };

  const handleImageError = (category: string, imageUrl: string) => {
    console.error(`❌ Image failed to load for ${category}:`, imageUrl);
    setImageLoadErrors(prev => new Set([...prev, category]));
    setImageLoadSuccess(prev => {
      const newSet = new Set(prev);
      newSet.delete(category);
      return newSet;
    });
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
          {CATEGORIES.map((category) => {
            const imageUrl = getCategoryImageUrl(category);
            const hasError = imageLoadErrors.has(category);
            const hasLoaded = imageLoadSuccess.has(category);
            
            console.log(`Rendering ${category}:`, { imageUrl, hasError, hasLoaded });
            
            return (
              <div key={category} className="space-y-3">
                <div className="aspect-[5/2] border rounded-lg overflow-hidden bg-muted relative">
                  {hasError ? (
                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                      <div className="text-center">
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-red-600">Failed to load image</p>
                        <p className="text-xs text-red-500 mt-1 px-2">{imageUrl}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={imageUrl}
                        alt={`${category} category`}
                        className="w-full h-full object-cover"
                        onLoad={() => handleImageLoad(category)}
                        onError={() => handleImageError(category, imageUrl)}
                      />
                      {!hasLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </>
                  )}
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
                  
                  {/* Debug info */}
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <div>Status: {hasError ? '❌ Error' : hasLoaded ? '✅ Loaded' : '⏳ Loading'}</div>
                    <div className="break-all">URL: {imageUrl}</div>
                  </div>
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
