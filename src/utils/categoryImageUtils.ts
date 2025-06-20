
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
      const { data } = await supabase.storage
        .from('category-images')
        .getPublicUrl(fileName);
      
      if (data?.publicUrl) {
        // Check if the file actually exists by making a head request
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            // Add cache-busting parameter to ensure fresh image loads
            const cacheBuster = `?t=${Date.now()}`;
            return data.publicUrl + cacheBuster;
          }
        } catch {
          // Continue to next extension if this one fails
          continue;
        }
      }
    }
  } catch (error) {
    console.log('No uploaded image found for category:', category);
  }
  
  // Fall back to default image if no uploaded image is found
  return getDefaultCategoryImage(category);
};

// Synchronous version for immediate use (returns default, but triggers async load)
const getCategoryImageUrlSync = (category: string) => {
  return getDefaultCategoryImage(category);
};

export { CATEGORIES, SUGGESTED_RESOLUTION, getCategoryImageUrl, getCategoryImageUrlSync };
