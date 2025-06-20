
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
  const [showImage, setShowImage] = useState(true);
  const isUploading = uploadingCategory === category;

  useEffect(() => {
    // Load the actual image (uploaded or default) asynchronously
    const loadCategoryImage = async () => {
      const url = await getCategoryImageUrl(category);
      setImageUrl(url);
    };
    
    loadCategoryImage();
  }, [category]);

  // Refresh image after upload with complete reset
  const handleUploadComplete = async () => {
    console.log('Upload completed for category:', category);
    setIsLoading(true);
    onUploadEnd();
    
    try {
      // Step 1: Completely hide the image to force unmount
      setShowImage(false);
      
      // Step 2: Wait for file processing and clear any browser cache
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: Clear the current image URL completely
      setImageUrl('');
      setImageKey(prev => prev + 1);
      
      // Step 4: Wait a bit more for complete cache invalidation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 5: Get the fresh URL with maximum cache busting
      const newUrl = await getCategoryImageUrl(category);
      console.log('New image URL after upload:', newUrl);
      
      // Step 6: Add multiple layers of cache busting
      const timestamp = Date.now();
      const random1 = Math.random().toString(36).substring(2, 15);
      const random2 = Math.random().toString(36).substring(2, 15);
      const sessionId = Math.random().toString(36).substring(2, 10);
      const cacheBustUrl = `${newUrl}&nocache=${timestamp}&rand=${random1}&fresh=${random2}&session=${sessionId}&version=3`;
      
      // Step 7: Set the new URL and show the image again
      setImageUrl(cacheBustUrl);
      setImageKey(prev => prev + 1);
      setShowImage(true);
      
      console.log('Final cache-busted URL:', cacheBustUrl);
      
    } catch (error) {
      console.error('Error refreshing image:', error);
      setShowImage(true);
    } finally {
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
        {showImage && imageUrl && (
          <img
            key={`${category}-${imageKey}-${Date.now()}`}
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
        )}
        {!showImage && (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-sm">Refreshing image...</div>
          </div>
        )}
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
