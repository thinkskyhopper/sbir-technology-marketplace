
import { supabase } from "@/integrations/supabase/client";

export const ensureCategoryImagesBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'category-images');
    
    if (!bucketExists) {
      console.log('Creating category-images bucket...');
      
      const { error: createError } = await supabase.storage.createBucket('category-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
      } else {
        console.log('Category images bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
  }
};
