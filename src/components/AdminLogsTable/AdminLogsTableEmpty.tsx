
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const AdminLogsTableEmpty = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Audit Logs Found</h3>
          <p className="text-muted-foreground">
            No administrative actions have been logged yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
