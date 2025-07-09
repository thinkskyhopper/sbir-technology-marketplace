
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
                      <Badge variant="outline" className="mb-1">
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
                    <div className="mb-2">
                      <p className="text-sm font-medium text-muted-foreground">User Notes:</p>
                      <p className="text-sm">{log.user_notes}</p>
                    </div>
                  )}
                  
                  {log.internal_notes && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Internal Notes:</p>
                      <p className="text-sm">{log.internal_notes}</p>
                    </div>
                  )}
                  
                  {log.changes_made && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Changes Made:</p>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(log.changes_made, null, 2)}
                      </pre>
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
