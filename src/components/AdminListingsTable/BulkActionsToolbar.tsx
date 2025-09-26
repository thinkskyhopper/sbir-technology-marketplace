import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  EyeOff, 
  Trash2, 
  ChevronDown,
  AlertTriangle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { SBIRListing } from "@/types/listings";

interface BulkActionsToolbarProps {
  selectedCount: number;
  selectedListings: SBIRListing[];
  onBulkApprove: (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => Promise<any>;
  onBulkReject: (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => Promise<any>;
  onBulkHide: (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => Promise<any>;
  onBulkDelete: (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => Promise<any>;
  onClearSelection: () => void;
  loading: boolean;
}

type BulkAction = 'approve' | 'reject' | 'hide' | 'delete' | null;

const BulkActionsToolbar = ({
  selectedCount,
  selectedListings,
  onBulkApprove,
  onBulkReject,
  onBulkHide,
  onBulkDelete,
  onClearSelection,
  loading
}: BulkActionsToolbarProps) => {
  const [confirmAction, setConfirmAction] = useState<BulkAction>(null);

  if (selectedCount === 0) return null;

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      switch (confirmAction) {
        case 'approve':
          await onBulkApprove(selectedListings);
          break;
        case 'reject':
          await onBulkReject(selectedListings);
          break;
        case 'hide':
          await onBulkHide(selectedListings);
          break;
        case 'delete':
          await onBulkDelete(selectedListings);
          break;
      }
      onClearSelection();
    } finally {
      setConfirmAction(null);
    }
  };

  const getActionConfig = (action: BulkAction) => {
    switch (action) {
      case 'approve':
        return {
          title: 'Approve Selected Listings',
          description: `Are you sure you want to approve ${selectedCount} listing${selectedCount !== 1 ? 's' : ''}?`,
          actionText: 'Approve',
          variant: 'default' as const
        };
      case 'reject':
        return {
          title: 'Reject Selected Listings',
          description: `Are you sure you want to reject ${selectedCount} listing${selectedCount !== 1 ? 's' : ''}?`,
          actionText: 'Reject',
          variant: 'destructive' as const
        };
      case 'hide':
        return {
          title: 'Hide Selected Listings',
          description: `Are you sure you want to hide ${selectedCount} listing${selectedCount !== 1 ? 's' : ''}?`,
          actionText: 'Hide',
          variant: 'destructive' as const
        };
      case 'delete':
        return {
          title: 'Delete Selected Listings',
          description: `Are you sure you want to permanently delete ${selectedCount} listing${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`,
          actionText: 'Delete',
          variant: 'destructive' as const
        };
      default:
        return null;
    }
  };

  const actionConfig = confirmAction ? getActionConfig(confirmAction) : null;

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="px-3 py-1">
            {selectedCount} selected
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction('approve')}
            disabled={loading}
            className="h-8"
          >
            <Check className="w-4 h-4" />
            Approve
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction('reject')}
            disabled={loading}
            className="h-8"
          >
            <X className="w-4 h-4" />
            Reject
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                className="h-8"
              >
                More Actions
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setConfirmAction('hide')}>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setConfirmAction('delete')}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={loading}
            className="h-8"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span>{actionConfig?.title}</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionConfig?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className={actionConfig?.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {loading ? 'Processing...' : actionConfig?.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkActionsToolbar;