
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

// Get category image URL - checks for uploaded image first, then falls back to default
const getCategoryImageUrl = async (category: string): Promise<string> => {
  try {
    // Create filename for the category
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    // Try to find an uploaded image with any of the common extensions
    for (const ext of possibleExtensions) {
      const fileName = `category-${categorySlug}.${ext}`;
      
      // Force a fresh request by bypassing any caching at the Supabase level
      const { data: fileList, error: listError } = await supabase.storage
        .from('category-images')
        .list('', { 
          search: fileName,
          limit: 1,
          offset: 0
        });
      
      console.log(`Checking for file: ${fileName}`, { fileList, listError });
      
      if (!listError && fileList && fileList.length > 0) {
        // File exists, now get a completely fresh public URL
        const { data } = await supabase.storage
          .from('category-images')
          .getPublicUrl(fileName, {
            download: false
          });
        
        if (data?.publicUrl) {
          // Create the most aggressive cache-busting possible
          const timestamp = Date.now();
          const random1 = Math.random().toString(36).substring(2, 15);
          const random2 = Math.random().toString(36).substring(2, 15);
          const random3 = Math.random().toString(36).substring(2, 15);
          const sessionId = performance.now().toString(36).substring(2, 10);
          const cacheBuster = `?nocache=${timestamp}&r1=${random1}&r2=${random2}&r3=${random3}&s=${sessionId}&v=4&force=true`;
          
          const finalUrl = data.publicUrl + cacheBuster;
          console.log('Found uploaded image for category:', category, finalUrl);
          return finalUrl;
        }
      }
    }
  } catch (error) {
    console.log('No uploaded image found for category:', category, error);
  }
  
  // Fall back to default image if no uploaded image is found
  console.log('Using default image for category:', category);
  return getDefaultCategoryImage(category);
};

// Synchronous version for immediate use (returns default, but triggers async load)
const getCategoryImageUrlSync = (category: string) => {
  return getDefaultCategoryImage(category);
};

export { CATEGORIES, SUGGESTED_RESOLUTION, getCategoryImageUrl, getCategoryImageUrlSync };
