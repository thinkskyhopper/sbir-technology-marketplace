
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  action_type: string;
  created_at: string;
  user_notes?: string;
  internal_notes?: string;
  changes_made?: any;
  admin_profile?: {
    full_name: string;
    email: string;
  };
}

interface AuditLogsSectionProps {
  auditLogs: AuditLog[] | undefined;
}

export const AuditLogsSection = ({ auditLogs }: AuditLogsSectionProps) => {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'approval': return 'Approved';
      case 'denial': return 'Rejected';
      case 'edit': return 'Edited';
      case 'deletion': return 'Deleted';
      default: return actionType;
    }
  };

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

  const getActionBadgeClassName = (actionType: string) => {
    if (actionType === 'approval') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          {auditLogs && auditLogs.length > 0 ? (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="border-l-2 border-muted pl-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge 
                        variant={getActionBadgeVariant(log.action_type)}
                        className={`mb-1 ${getActionBadgeClassName(log.action_type)}`}
                      >
                        {getActionTypeLabel(log.action_type)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(log.created_at)}
                      </p>
                    </div>
                    {log.admin_profile && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{log.admin_profile.full_name}</p>
                        <p className="text-xs text-muted-foreground">{log.admin_profile.email}</p>
                      </div>
                    )}
                  </div>
                  
                  {log.user_notes && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-muted-foreground mb-1">User Notes:</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                        <p className="text-sm whitespace-pre-wrap">{log.user_notes}</p>
                      </div>
                    </div>
                  )}
                  
                  {log.internal_notes && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Internal Notes:</p>
                      <div className="bg-muted rounded-md p-2 border">
                        <p className="text-sm whitespace-pre-wrap">{log.internal_notes}</p>
                      </div>
                    </div>
                  )}
                  
                  {log.changes_made && Object.keys(log.changes_made).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Changes Made:</p>
                      <div className="bg-muted rounded-md p-3 border">
                        <div className="space-y-2">
                          {Object.entries(log.changes_made).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start gap-4">
                              <span className="text-sm font-medium capitalize min-w-0 flex-shrink-0">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-sm text-muted-foreground text-right break-words">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No audit logs available for this listing.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
