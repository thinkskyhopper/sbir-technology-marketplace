
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface NotificationCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userName: string | null;
  categories: string[];
}

export const NotificationCategoriesDialog = ({
  open,
  onOpenChange,
  userEmail,
  userName,
  categories
}: NotificationCategoriesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Email Notification Categories</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="font-medium">{userName || userEmail}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-3">
              Subscribed to {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}:
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
