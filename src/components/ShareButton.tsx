
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Share, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  listingId: string;
  listingTitle: string;
}

const ShareButton = ({ listingId, listingTitle }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState<'direct' | 'meta'>('meta');
  const { toast } = useToast();
  
  const directUrl = `${window.location.origin}/listing/${listingId}`;
  const metaUrl = `https://amhznlnhrrugxatbeayo.supabase.co/functions/v1/meta-tags?id=${listingId}`;
  
  const shareUrl = shareType === 'meta' ? metaUrl : directUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The listing link has been copied to your clipboard.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the link below.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).select();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg">
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
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-3 block">Choose link type:</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded border hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    name="shareType"
                    value="meta"
                    checked={shareType === 'meta'}
                    onChange={() => setShareType('meta')}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex items-center flex-1">
                    <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Social Media Link</div>
                      <div className="text-xs text-muted-foreground">Shows preview with listing details on LinkedIn, Facebook, Twitter, etc.</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded border hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    name="shareType"
                    value="direct"
                    checked={shareType === 'direct'}
                    onChange={() => setShareType('direct')}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex items-center flex-1">
                    <Share className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Direct Link</div>
                      <div className="text-xs text-muted-foreground">Goes straight to the listing page</div>
                    </div>
                  </div>
                </label>
              </div>
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
