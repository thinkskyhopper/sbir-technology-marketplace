
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCategoryImageUrl, clearCategoryCache } from "@/utils/categoryImageUtils";

export const useCategoryImageRestore = (category: string, onImageUpdate: (url: string, uploaded: boolean) => void) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const { toast } = useToast();

  const handleRestoreDefault = async () => {
    setIsRestoring(true);
    
    try {
      // Delete the uploaded file from storage
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      
      for (const ext of possibleExtensions) {
        const fileName = `category-${categorySlug}.${ext}`;
        await supabase.storage
          .from('category-images')
          .remove([fileName]);
      }
      
      // Clear cache and refresh with default image
      clearCategoryCache(category);
      const newUrl = await getCategoryImageUrl(category);
      
      onImageUpdate(newUrl, false);
      
      toast({
        title: "Image restored",
        description: `The ${category} category image has been restored to default.`,
      });
      
    } catch (error) {
      console.error('Error restoring default image:', error);
      toast({
        title: "Restore failed",
        description: "Failed to restore default image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
      setShowRestoreDialog(false);
    }
  };

  return {
    isRestoring,
    showRestoreDialog,
    setShowRestoreDialog,
    handleRestoreDefault
  };
};
