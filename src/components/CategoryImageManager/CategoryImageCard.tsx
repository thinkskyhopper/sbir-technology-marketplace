
import { Label } from "@/components/ui/label";
import { SUGGESTED_RESOLUTION } from "@/utils/categoryImageUtils";
import CategoryImageDisplay from "./CategoryImageDisplay";
import CategoryImageActions from "./CategoryImageActions";
import ConfirmActionDialog from "../ConfirmActionDialog";
import { useCategoryImageState } from "./useCategoryImageState";
import { useCategoryImageRestore } from "./useCategoryImageRestore";

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
  const {
    imageUrl,
    isUploaded,
    imageKey,
    isLoading,
    imageLoadError,
    handleImageLoad,
    handleImageError,
    refreshImage,
    updateImageState
  } = useCategoryImageState(category);

  const {
    isRestoring,
    showRestoreDialog,
    setShowRestoreDialog,
    handleRestoreDefault
  } = useCategoryImageRestore(category, updateImageState);

  const isUploading = uploadingCategory === category;

  // Handle upload completion with optimized refresh
  const handleUploadComplete = async () => {
    onUploadEnd();
    await refreshImage();
  };

  return (
    <div className="space-y-3">
      <CategoryImageDisplay
        category={category}
        imageUrl={imageUrl}
        imageKey={imageKey}
        isLoading={isLoading}
        isUploading={isUploading}
        isRestoring={isRestoring}
        imageLoadError={imageLoadError}
        isUploaded={isUploaded}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">{category}</Label>
        
        <CategoryImageActions
          category={category}
          isUploading={isUploading}
          isRestoring={isRestoring}
          isUploaded={isUploaded}
          onUploadStart={onUploadStart}
          onUploadComplete={handleUploadComplete}
          onRestoreClick={() => setShowRestoreDialog(true)}
        />
        
        <p className="text-xs text-muted-foreground">
          Suggested: {SUGGESTED_RESOLUTION}
        </p>
      </div>
      
      {/* Restore confirmation dialog */}
      <ConfirmActionDialog
        open={showRestoreDialog}
        onOpenChange={setShowRestoreDialog}
        onConfirm={handleRestoreDefault}
        title="Restore Default Image"
        description={`Are you sure you want to restore the default image for ${category}? This will permanently delete the uploaded image.`}
        confirmText="Restore Default"
        variant="destructive"
      />
    </div>
  );
};

export default CategoryImageCard;
