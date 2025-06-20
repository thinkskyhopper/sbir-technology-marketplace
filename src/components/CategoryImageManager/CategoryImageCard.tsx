
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryImageUrl, getCategoryImageUrlSync, SUGGESTED_RESOLUTION, clearCategoryCache } from "@/utils/categoryImageUtils";
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
  // Get initial state from cache
  const initialState = getCategoryImageUrlSync(category);
  const [imageUrl, setImageUrl] = useState(initialState.url);
  const [isUploaded, setIsUploaded] = useState(initialState.isUploaded);
  const [imageKey, setImageKey] = useState(0);
  const [isLoading, setIsLoading] = useState(initialState.isUploaded === null); // Loading if we don't know the status
  const [imageLoadError, setImageLoadError] = useState(false);
  const isUploading = uploadingCategory === category;

  useEffect(() => {
    // Only load asynchronously if we don't have cached info or if we're unsure
    if (isUploaded === null) {
      const loadCategoryImage = async () => {
        try {
          setIsLoading(true);
          const url = await getCategoryImageUrl(category);
          setImageUrl(url);
          // The utility now handles caching, so we can get the updated status
          const updatedState = getCategoryImageUrlSync(category);
          setIsUploaded(updatedState.isUploaded);
        } catch (error) {
          console.error('Error loading category image:', error);
          setImageLoadError(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadCategoryImage();
    }
  }, [category, isUploaded]);

  // Handle upload completion with optimized refresh
  const handleUploadComplete = async () => {
    console.log('Upload completed for category:', category);
    setIsLoading(true);
    setImageLoadError(false);
    onUploadEnd();
    
    try {
      // Clear cache for this category to force refresh
      clearCategoryCache(category);
      
      // Wait a bit for file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the fresh image URL
      const newUrl = await getCategoryImageUrl(category);
      console.log('New image URL after upload:', newUrl);
      
      // Update state with new URL and increment key for React refresh
      setImageUrl(newUrl);
      setIsUploaded(true);
      setImageKey(prev => prev + 1);
      
    } catch (error) {
      console.error('Error refreshing image after upload:', error);
      setImageLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', category, imageUrl);
    setIsLoading(false);
    setImageLoadError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image load error:', category, e);
    setIsLoading(false);
    setImageLoadError(true);
  };

  return (
    <div className="space-y-3">
      <div className="aspect-[5/2] border rounded-lg overflow-hidden bg-muted relative">
        {/* Loading overlay */}
        {(isLoading || isUploading) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="text-white text-sm">
              {isUploading ? 'Uploading...' : 'Loading...'}
            </div>
          </div>
        )}
        
        {/* Skeleton loader for initial loading */}
        {isLoading && isUploaded === null && (
          <Skeleton className="w-full h-full absolute inset-0" />
        )}
        
        {/* Error state */}
        {imageLoadError && (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Failed to load image</p>
              <p className="text-xs">Using fallback</p>
            </div>
          </div>
        )}
        
        {/* Main image */}
        <img
          key={`${category}-${imageKey}`}
          src={imageUrl}
          alt={`${category} category`}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="eager" // Load immediately for above-the-fold content
        />
        
        {/* Upload status indicator */}
        {isUploaded === true && !isLoading && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            Custom
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
