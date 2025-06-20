
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, preloadAllCategoryImages } from "@/utils/categoryImageUtils";
import CategoryImageCard from "./CategoryImageManager/CategoryImageCard";

const CategoryImageManager = () => {
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  // Preload images on component mount
  useEffect(() => {
    // Start preloading in the background
    preloadAllCategoryImages().catch(error => {
      console.log('Some images failed to preload:', error);
    });
  }, []);

  const handleUploadStart = (category: string) => {
    setUploadingCategory(category);
  };

  const handleUploadEnd = () => {
    setUploadingCategory(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryImageCard
              key={category}
              category={category}
              uploadingCategory={uploadingCategory}
              onUploadStart={handleUploadStart}
              onUploadEnd={handleUploadEnd}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryImageManager;
