
import { useState, useEffect } from "react";
import { getCategoryImageUrl, getCategoryImageUrlSync, clearCategoryCache } from "@/utils/categoryImageUtils";

export const useCategoryImageState = (category: string) => {
  // Get initial state from cache
  const initialState = getCategoryImageUrlSync(category);
  const [imageUrl, setImageUrl] = useState(initialState.url);
  const [isUploaded, setIsUploaded] = useState(initialState.isUploaded);
  const [imageKey, setImageKey] = useState(0);
  // Only show loading if we're uncertain about upload status
  const [isLoading, setIsLoading] = useState(initialState.isUploaded === null);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    // Only load asynchronously if we don't have cached info
    if (isUploaded === null) {
      const loadCategoryImage = async () => {
        try {
          const url = await getCategoryImageUrl(category);
          
          // Only update if the URL actually changed to prevent unnecessary re-renders
          if (url !== imageUrl) {
            setImageUrl(url);
            setImageKey(prev => prev + 1);
          }
          
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
    } else {
      // We have cached info, so no need to load
      setIsLoading(false);
    }
  }, [category, isUploaded, imageUrl]);

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

  const refreshImage = async () => {
    console.log('Upload completed for category:', category);
    setIsLoading(true);
    setImageLoadError(false);
    
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

  const updateImageState = (url: string, uploaded: boolean) => {
    setImageUrl(url);
    setIsUploaded(uploaded);
    setImageKey(prev => prev + 1);
  };

  return {
    imageUrl,
    isUploaded,
    imageKey,
    isLoading,
    imageLoadError,
    setIsLoading,
    setImageLoadError,
    handleImageLoad,
    handleImageError,
    refreshImage,
    updateImageState
  };
};
