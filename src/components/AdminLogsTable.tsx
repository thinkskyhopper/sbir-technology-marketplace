
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLogsTableContent } from "./AdminLogsTable/AdminLogsTableContent";
import { AdminLogsTableLoading } from "./AdminLogsTable/AdminLogsTableLoading";
import { AdminLogsTableEmpty } from "./AdminLogsTable/AdminLogsTableEmpty";
import { AdminLogsDetailDialog } from "./AdminLogsTable/AdminLogsDetailDialog";
import { usePagination } from "@/hooks/usePagination";
import { useSorting } from "@/hooks/useSorting";
import type { AdminAuditLog } from "./AdminLogsTable/types";

export const AdminLogsTable = () => {
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      console.log('🔍 Fetching admin audit logs...');
      
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select(`
          *,
          admin:profiles!admin_audit_logs_admin_id_fkey(full_name, email),
          listing:sbir_listings(title, status, public_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching admin audit logs:', error);
        throw error;
      }

      console.log('✅ Admin audit logs fetched:', data?.length || 0);
      return data as AdminAuditLog[];
    }
  });

  const { sortedData, sortState, handleSort } = useSorting(logs, {
    column: 'created_at',
    direction: 'desc'
  });

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems
  } = usePagination({
    data: sortedData,
    itemsPerPage: 10
  });

  const handleViewDetails = (log: AdminAuditLog) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  if (isLoading) return <AdminLogsTableLoading />;

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Failed to load admin audit logs. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) return <AdminLogsTableEmpty />;

  return (
    <>
      <AdminLogsTableContent
        logs={paginatedData}
        sortState={sortState}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />

      <AdminLogsDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        log={selectedLog}
      />
    </>
  );
};
