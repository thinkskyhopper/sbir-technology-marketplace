
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { getCategoryImageUrl, getCategoryImageUrlSync, SUGGESTED_RESOLUTION } from "@/utils/categoryImageUtils";
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
  const [imageUrl, setImageUrl] = useState(() => getCategoryImageUrlSync(category));
  const isUploading = uploadingCategory === category;

  useEffect(() => {
    // Load the actual image (uploaded or default) asynchronously
    const loadCategoryImage = async () => {
      const url = await getCategoryImageUrl(category);
      setImageUrl(url);
    };
    
    loadCategoryImage();
  }, [category]);

  // Refresh image after upload
  const handleUploadComplete = async () => {
    onUploadEnd();
    // Refresh the image URL to show the newly uploaded image
    const url = await getCategoryImageUrl(category);
    setImageUrl(url);
  };

  return (
    <div className="space-y-3">
      <div className="aspect-[5/2] border rounded-lg overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={`${category} category`}
          className="w-full h-full object-cover"
        />
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
