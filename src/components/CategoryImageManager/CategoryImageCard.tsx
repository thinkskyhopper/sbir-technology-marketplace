
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { getCategoryImageUrl, getCategoryImageUrlSync, SUGGESTED_RESOLUTION } from "@/utils/categoryImageUtils";
import CategoryImageUpload from "./CategoryImageUpload";

interface CategoryImageCardProps {
  category: string;
  uploadingCategory: string | null;
  onUploadStart: (category: string) => void;
  onUploadEnd: () => void;
}

const CategoryImageCard = ({ 
  category, 
  uploadingCategory, 
  onUploadStart, 
  onUploadEnd 
}: CategoryImageCardProps) => {
  const [imageUrl, setImageUrl] = useState(() => getCategoryImageUrlSync(category));
  const [imageKey, setImageKey] = useState(0); // For cache busting
  const [isLoading, setIsLoading] = useState(false);
  const isUploading = uploadingCategory === category;

  useEffect(() => {
    // Load the actual image (uploaded or default) asynchronously
    const loadCategoryImage = async () => {
      const url = await getCategoryImageUrl(category);
      setImageUrl(url);
    };
    
    loadCategoryImage();
  }, [category]);

  // Refresh image after upload with more aggressive cache busting
  const handleUploadComplete = async () => {
    console.log('Upload completed for category:', category);
    setIsLoading(true);
    onUploadEnd();
    
    // Add a small delay to ensure the file is fully processed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Force refresh the image URL to show the newly uploaded image
      const url = await getCategoryImageUrl(category);
      console.log('New image URL:', url);
      
      // Update both the URL and key to force complete re-render
      setImageUrl(url);
      setImageKey(prev => prev + 1);
      
      // Force a browser cache refresh by preloading the new image
      const img = new Image();
      img.onload = () => {
        console.log('New image preloaded successfully');
        setIsLoading(false);
      };
      img.onerror = () => {
        console.error('Failed to preload new image');
        setIsLoading(false);
      };
      img.src = url;
    } catch (error) {
      console.error('Error refreshing image:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="aspect-[5/2] border rounded-lg overflow-hidden bg-muted relative">
        {(isLoading || isUploading) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="text-white text-sm">
              {isUploading ? 'Uploading...' : 'Updating...'}
            </div>
          </div>
        )}
        <img
          key={`${category}-${imageKey}`}
          src={imageUrl}
          alt={`${category} category`}
          className="w-full h-full object-cover"
          onLoad={() => console.log('Image loaded:', category, imageUrl)}
          onError={(e) => console.error('Image load error:', category, e)}
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">{category}</Label>
        
        <CategoryImageUpload
          category={category}
          isUploading={isUploading}
          onUploadStart={onUploadStart}
          onUploadEnd={handleUploadComplete}
        />
        
        <p className="text-xs text-muted-foreground">
          Suggested: {SUGGESTED_RESOLUTION}
        </p>
      </div>
    </div>
  );
};

export default CategoryImageCard;
