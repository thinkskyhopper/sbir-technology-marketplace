
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryImageDisplayProps {
  category: string;
  imageUrl: string;
  imageKey: number;
  isLoading: boolean;
  isUploading: boolean;
  isRestoring: boolean;
  imageLoadError: boolean;
  isUploaded: boolean | null;
  onImageLoad: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const CategoryImageDisplay = ({
  category,
  imageUrl,
  imageKey,
  isLoading,
  isUploading,
  isRestoring,
  imageLoadError,
  isUploaded,
  onImageLoad,
  onImageError
}: CategoryImageDisplayProps) => {
  return (
    <div className="aspect-[5/2] border rounded-lg overflow-hidden bg-muted relative">
      {/* Loading overlay */}
      {(isLoading || isUploading || isRestoring) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-white text-sm">
            {isUploading ? 'Uploading...' : isRestoring ? 'Restoring...' : 'Loading...'}
          </div>
        </div>
      )}
      
      {/* Skeleton loader for initial loading */}
      {isLoading && isUploaded === null && (
        <Skeleton className="w-full h-full absolute inset-0" />
      )}
      
      {/* Error state */}
      {imageLoadError && (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Failed to load image</p>
            <p className="text-xs">Using fallback</p>
          </div>
        </div>
      )}
      
      {/* Main image */}
      <img
        key={`${category}-${imageKey}`}
        src={imageUrl}
        alt={`${category} category`}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={onImageLoad}
        onError={onImageError}
        loading="eager"
      />
      
      {/* Upload status indicator */}
      {isUploaded === true && !isLoading && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Custom
        </div>
      )}
    </div>
  );
};

export default CategoryImageDisplay;
