
import { CACHE_DURATION, STORAGE_KEY } from './categoryConstants';

interface CacheEntry {
  url: string;
  isUploaded: boolean;
  timestamp: number;
}

// Cache for storing image URLs and their existence status
const imageCache = new Map<string, CacheEntry>();

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

export const getCachedEntry = (category: string): CacheEntry | undefined => {
  const cached = imageCache.get(category);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached;
  }
  
  return undefined;
};

export const setCacheEntry = (category: string, url: string, isUploaded: boolean) => {
  const entry = {
    url,
    isUploaded,
    timestamp: Date.now()
  };
  
  imageCache.set(category, entry);
  saveCacheToStorage();
  
  console.log(`Cached image info for ${category}:`, { url, isUploaded });
};

export const clearCategoryCache = (category: string) => {
  imageCache.delete(category);
  saveCacheToStorage();
  console.log(`Cleared cache for category: ${category}`);
};

export const clearAllCache = () => {
  imageCache.clear();
  localStorage.removeItem(STORAGE_KEY);
  console.log('Cleared all image cache');
};
