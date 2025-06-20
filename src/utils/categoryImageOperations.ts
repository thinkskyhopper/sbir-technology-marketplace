
import { supabase } from "@/integrations/supabase/client";

// Check if an uploaded image exists for a category
export const checkUploadedImageExists = async (category: string): Promise<{ exists: boolean; url?: string }> => {
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

// Preload images for better performance
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
};
