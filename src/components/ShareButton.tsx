
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Share, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  listingId: string;
  listingTitle: string;
  className?: string;
}

const ShareButton = ({ listingId, listingTitle, className }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/listing/${listingId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied!", {
        description: "The listing link has been copied to your clipboard.",
        duration: 5000,
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy", {
        description: "Please manually copy the link below.",
        duration: 5000,
      });
    }
  };

  const handleSelectAll = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).select();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg" className={`flex-1 lg:flex-none ${className || ''}`}>
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Share this listing</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Share "{listingTitle}" with others
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Link to copy:</label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                onClick={handleSelectAll}
                className="flex-1 text-sm"
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className={copied ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
