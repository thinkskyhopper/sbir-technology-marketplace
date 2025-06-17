
import { Shield } from "lucide-react";

const SpamProtectionInfo = () => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Spam Protection</span>
      </div>
      <p className="text-xs text-muted-foreground">
        All listings are reviewed before publication. Please ensure your content is professional 
        and related to legitimate SBIR projects.
      </p>
    </div>
  );
};

export default SpamProtectionInfo;
