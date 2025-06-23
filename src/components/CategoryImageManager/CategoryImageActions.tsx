
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import CategoryImageUpload from "./CategoryImageUpload";

interface CategoryImageActionsProps {
  category: string;
  isUploading: boolean;
  isRestoring: boolean;
  isUploaded: boolean | null;
  onUploadStart: (category: string) => void;
  onUploadComplete: () => void;
  onRestoreClick: () => void;
}

const CategoryImageActions = ({
  category,
  isUploading,
  isRestoring,
  isUploaded,
  onUploadStart,
  onUploadComplete,
  onRestoreClick
}: CategoryImageActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <CategoryImageUpload
          category={category}
          isUploading={isUploading}
          onUploadStart={onUploadStart}
          onUploadEnd={onUploadComplete}
        />
      </div>
      
      {/* Restore button - only show when image is uploaded */}
      {isUploaded === true && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRestoreClick}
          disabled={isUploading || isRestoring}
          className="flex items-center space-x-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restore Default</span>
        </Button>
      )}
    </div>
  );
};

export default CategoryImageActions;
