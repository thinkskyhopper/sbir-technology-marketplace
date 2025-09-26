import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  EyeOff, 
  Clock,
  DollarSign,
  X
} from 'lucide-react';
import type { SBIRListing } from '@/types/listings';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkStatusChange: (newStatus: SBIRListing['status'], userNotes?: string, internalNotes?: string) => Promise<void>;
  onBulkDelete: (userNotes?: string, internalNotes?: string) => Promise<void>;
  onClearSelection: () => void;
  loading: boolean;
}

type BulkAction = 'delete' | 'status' | null;

const BulkActionsToolbar = ({
  selectedCount,
  onBulkStatusChange,
  onBulkDelete,
  onClearSelection,
  loading
}: BulkActionsToolbarProps) => {
  const [confirmAction, setConfirmAction] = useState<BulkAction>(null);
  const [selectedStatus, setSelectedStatus] = useState<SBIRListing['status'] | ''>('');

  if (selectedCount === 0) return null;

  const handleConfirm = async () => {
    try {
      switch (confirmAction) {
        case 'status':
          if (selectedStatus) {
            await onBulkStatusChange(selectedStatus);
          }
          break;
        case 'delete':
          await onBulkDelete();
          break;
      }
      onClearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setConfirmAction(null);
      setSelectedStatus('');
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status as SBIRListing['status']);
    setConfirmAction('status');
  };

  const getActionConfig = () => {
    switch (confirmAction) {
      case 'status':
        return {
          title: 'Change Status of Selected Listings',
          description: `Are you sure you want to change ${selectedCount} listing${selectedCount !== 1 ? 's' : ''} to ${selectedStatus}?`,
          actionText: 'Change Status',
          variant: 'default' as const
        };
      case 'delete':
        return {
          title: 'Delete Selected Listings',
          description: `Are you sure you want to permanently delete ${selectedCount} listing${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`,
          actionText: 'Delete',
          variant: 'destructive' as const
        };
      default:
        return {
          title: '',
          description: '',
          actionText: '',
          variant: 'default' as const
        };
    }
  };

  const actionConfig = getActionConfig();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Sold':
        return <DollarSign className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Hidden':
        return <EyeOff className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-muted/50 border-b">
        <span className="text-sm text-muted-foreground">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected across all pages
        </span>
        
        <div className="flex items-center gap-2 ml-auto">
          <Select onValueChange={handleStatusChange} disabled={loading}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">
                <div className="flex items-center gap-2">
                  {getStatusIcon('Active')}
                  Active
                </div>
              </SelectItem>
              <SelectItem value="Pending">
                <div className="flex items-center gap-2">
                  {getStatusIcon('Pending')}
                  Pending
                </div>
              </SelectItem>
              <SelectItem value="Sold">
                <div className="flex items-center gap-2">
                  {getStatusIcon('Sold')}
                  Sold
                </div>
              </SelectItem>
              <SelectItem value="Rejected">
                <div className="flex items-center gap-2">
                  {getStatusIcon('Rejected')}
                  Rejected
                </div>
              </SelectItem>
              <SelectItem value="Hidden">
                <div className="flex items-center gap-2">
                  {getStatusIcon('Hidden')}
                  Hidden
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmAction('delete')}
            disabled={loading}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={loading}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Selection
          </Button>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className={actionConfig.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {loading ? 'Processing...' : actionConfig.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkActionsToolbar;