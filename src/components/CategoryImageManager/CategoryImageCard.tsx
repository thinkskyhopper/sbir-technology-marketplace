
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

  // Refresh image after upload with aggressive cache invalidation
  const handleUploadComplete = async () => {
    console.log('Upload completed for category:', category);
    setIsLoading(true);
    onUploadEnd();
    
    try {
      // Wait longer to ensure file is fully processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force a complete cache invalidation by temporarily showing default image
      const defaultUrl = getCategoryImageUrlSync(category);
      setImageUrl(defaultUrl);
      setImageKey(prev => prev + 1);
      
      // Wait a bit more then load the new uploaded image
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the new uploaded image URL with aggressive cache busting
      const newUrl = await getCategoryImageUrl(category);
      console.log('New image URL after upload:', newUrl);
      
      // Force browser to ignore all cached versions
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const cacheBustUrl = `${newUrl}&force=${timestamp}&refresh=${random}`;
      
      // Update the image URL and force re-render
      setImageUrl(cacheBustUrl);
      setImageKey(prev => prev + 1);
      
      setIsLoading(false);
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
          onLoad={() => {
            console.log('Image loaded successfully:', category, imageUrl);
            setIsLoading(false);
          }}
          onError={(e) => {
            console.error('Image load error:', category, e);
            setIsLoading(false);
          }}
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
