
import { CATEGORIES, SUGGESTED_RESOLUTION } from './categoryConstants';
import { getCachedEntry, setCacheEntry, clearCategoryCache, clearAllCache } from './categoryImageCache';
import { getDefaultCategoryImage } from './categoryDefaultImages';
import { checkUploadedImageExists, preloadImage } from './categoryImageOperations';

// Get category image URL with smart caching
const getCategoryImageUrl = async (category: string): Promise<string> => {
  const cached = getCachedEntry(category);
  
  // Return cached result if valid and not expired
  if (cached) {
    console.log('Using cached image for category:', category, cached.isUploaded ? 'uploaded' : 'default');
    return cached.url;
  }
  
  try {
    // Check for uploaded image
    const uploadedResult = await checkUploadedImageExists(category);
    
    let finalUrl: string;
    let isUploaded: boolean;
    
    if (uploadedResult.exists && uploadedResult.url) {
      finalUrl = uploadedResult.url;
      isUploaded = true;
      console.log('Found uploaded image for category:', category, finalUrl);
    } else {
      finalUrl = getDefaultCategoryImage(category);
      isUploaded = false;
      console.log('Using default image for category:', category);
    }
    
    // Cache the result
    setCacheEntry(category, finalUrl, isUploaded);
    
    return finalUrl;
  } catch (error) {
    console.log('Error in getCategoryImageUrl:', error);
    return getDefaultCategoryImage(category);
  }
};

// Synchronous version that checks cache first, falls back to default
const getCategoryImageUrlSync = (category: string): { url: string; isUploaded: boolean | null } => {
  const cached = getCachedEntry(category);
  
  if (cached) {
    return { url: cached.url, isUploaded: cached.isUploaded };
  }
  
  // Return default with unknown upload status if no cache
  return { url: getDefaultCategoryImage(category), isUploaded: null };
};

// Preload all category images
const preloadAllCategoryImages = async () => {
  console.log('Starting to preload category images...');
  
  const preloadPromises = CATEGORIES.map(async (category) => {
    try {
      const imageUrl = await getCategoryImageUrl(category);
      await preloadImage(imageUrl);
      console.log('Preloaded image for category:', category);
    } catch (error) {
      console.log('Failed to preload image for category:', category, error);
    }
  });
  
  await Promise.allSettled(preloadPromises);
  console.log('Finished preloading category images');
};

export { 
  CATEGORIES, 
  SUGGESTED_RESOLUTION, 
  getCategoryImageUrl, 
  getCategoryImageUrlSync,
  preloadAllCategoryImages,
  clearCategoryCache,
  clearAllCache
};
