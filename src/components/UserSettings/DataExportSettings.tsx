import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Shield, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const DataExportSettings = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await supabase.functions.invoke('export-user-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Create and download the file
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully. Check your downloads folder.",
      });

    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Data Export & Portability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Your Right to Data Portability</p>
              <p className="text-sm text-muted-foreground mt-1">
                You have the right to receive your personal data in a structured, commonly used, and machine-readable format. 
                This export includes all your profile information, listings, and account preferences.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Export Includes:</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Profile information (name, email, company, bio)</li>
            <li>Account preferences and notification settings</li>
            <li>All submitted SBIR listings</li>
            <li>Account creation and update timestamps</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Data Security Notice</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                The exported file contains sensitive personal information. Please store it securely and delete it when no longer needed.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleExportData} 
          disabled={isExporting}
          className="w-full sm:w-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting Data...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Export My Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataExportSettings;