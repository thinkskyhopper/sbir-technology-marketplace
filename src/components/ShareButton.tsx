
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
              <label className="text-sm font-medium mb-2 block">Link type:</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={shareType === 'meta' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareType('meta')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Social Media
                </Button>
                <Button
                  variant={shareType === 'direct' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareType('direct')}
                  className="text-xs"
                >
                  Direct Link
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {shareType === 'meta' ? 'Social media link:' : 'Direct link:'}
              </label>
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
          
          <div className="text-xs text-muted-foreground">
            {shareType === 'meta' ? 
              'Social media link shows preview with listing details when shared on LinkedIn, Facebook, etc.' :
              'Direct link goes straight to the listing page.'
            }
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
