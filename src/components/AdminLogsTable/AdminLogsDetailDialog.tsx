
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import type { AdminAuditLog } from "./types";

interface AdminLogsDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AdminAuditLog | null;
}

export const AdminLogsDetailDialog = ({
  open,
  onOpenChange,
  log,
}: AdminLogsDetailDialogProps) => {
  if (!log) return null;

  const getActionBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case 'approval':
        return 'default';
      case 'denial':
        return 'destructive';
      case 'edit':
        return 'secondary';
      case 'deletion':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'approval':
        return 'Approved';
      case 'denial':
        return 'Rejected';
      case 'edit':
        return 'Modified';
      case 'deletion':
        return 'Deleted';
      default:
        return actionType;
    }
  };

  const isListingDeleted = !log.listing || (log.listing && log.action_type === 'deletion');
  const adminName = log.admin?.full_name || log.admin?.email || 'Unknown Admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Admin Action Details
            <Badge variant={getActionBadgeVariant(log.action_type)}>
              {getActionLabel(log.action_type)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Action Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Date & Time</h4>
                  <p className="text-sm">
                    {format(new Date(log.created_at), 'MMMM dd, yyyy')} at{' '}
                    {format(new Date(log.created_at), 'HH:mm')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Admin</h4>
                  <p className="text-sm">{adminName}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Listing</h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{log.listing_title}</p>
                  {isListingDeleted && (
                    <Badge variant="outline" className="text-xs">
                      Deleted
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{log.listing_agency}</p>
              </div>
            </CardContent>
          </Card>

          {/* User Notes */}
          {log.user_notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes for User</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{log.user_notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Internal Notes */}
          {log.internal_notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{log.internal_notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Changes Made */}
          {log.changes_made && Object.keys(log.changes_made).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Changes Made</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(log.changes_made).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={log.user_notified ? "default" : "secondary"}>
                  {log.user_notified ? "User Notified" : "User Not Notified"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
