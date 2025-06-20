
import { supabase } from "@/integrations/supabase/client";

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

// Cache for storing image URLs and their existence status
const imageCache = new Map<string, { url: string; isUploaded: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// LocalStorage key for persisting image cache
const STORAGE_KEY = 'category-image-cache';

// Load cache from localStorage on initialization
const loadCacheFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        // Only load if not expired
        if (Date.now() - value.timestamp < CACHE_DURATION) {
          imageCache.set(key, value);
        }
      });
    }
  } catch (error) {
    console.log('Failed to load image cache from localStorage:', error);
  }
};

// Save cache to localStorage
const saveCacheToStorage = () => {
  try {
    const cacheObj = Object.fromEntries(imageCache);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObj));
  } catch (error) {
    console.log('Failed to save image cache to localStorage:', error);
  }
};

// Initialize cache from localStorage
loadCacheFromStorage();

// Default fallback images for each category
const getDefaultCategoryImage = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  // Check Advanced Materials first to avoid conflicts with other material-related terms
  if (categoryLower.includes('advanced materials') || (categoryLower.includes('advanced') && categoryLower.includes('materials'))) {
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

// Check if an uploaded image exists for a category
const checkUploadedImageExists = async (category: string): Promise<{ exists: boolean; url?: string }> => {
  try {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    for (const ext of possibleExtensions) {
      const fileName = `category-${categorySlug}.${ext}`;
      
      const { data } = await supabase.storage
        .from('category-images')
        .getPublicUrl(fileName);
      
      if (data?.publicUrl) {
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const cacheBuster = `?nocache=${timestamp}&rand=${random}&v=5`;
            return { exists: true, url: data.publicUrl + cacheBuster };
          }
        } catch (fetchError) {
          continue;
        }
      }
    }
    
    return { exists: false };
  } catch (error) {
    console.log('Error checking uploaded image:', error);
    return { exists: false };
  }
};

// Get category image URL with smart caching
const getCategoryImageUrl = async (category: string): Promise<string> => {
  const cacheKey = category;
  const cached = imageCache.get(cacheKey);
  
  // Return cached result if valid and not expired
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
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
    imageCache.set(cacheKey, {
      url: finalUrl,
      isUploaded,
      timestamp: Date.now()
    });
    
    // Save to localStorage
    saveCacheToStorage();
    
    return finalUrl;
  } catch (error) {
    console.log('Error in getCategoryImageUrl:', error);
    return getDefaultCategoryImage(category);
  }
};

// Synchronous version that checks cache first, falls back to default
const getCategoryImageUrlSync = (category: string): { url: string; isUploaded: boolean | null } => {
  const cached = imageCache.get(category);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { url: cached.url, isUploaded: cached.isUploaded };
  }
  
  // Return default with unknown upload status if no cache
  return { url: getDefaultCategoryImage(category), isUploaded: null };
};

// Preload images for better performance
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
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

// Clear cache for a specific category (useful after upload)
const clearCategoryCache = (category: string) => {
  imageCache.delete(category);
  saveCacheToStorage();
};

// Clear all cache
const clearAllCache = () => {
  imageCache.clear();
  localStorage.removeItem(STORAGE_KEY);
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
