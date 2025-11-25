
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Users } from "lucide-react";
import { UserWithStats } from "./types";
import { useToast } from "@/hooks/use-toast";

interface MarketingSubscribersDialogProps {
  users: UserWithStats[] | undefined;
  marketingSubscribers: UserWithStats[];
}

export const MarketingSubscribersDialog = ({ users, marketingSubscribers }: MarketingSubscribersDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const exportMarketingSubscribers = () => {
    if (!marketingSubscribers || marketingSubscribers.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no marketing subscribers to export.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const csvHeaders = "First Name,Last Name,Full Name,Email,Role,Joined Date\n";
    const csvContent = marketingSubscribers.map(user => {
      const firstName = user.full_name?.split(' ')[0] || '';
      const lastName = user.full_name?.split(' ').slice(1).join(' ') || '';
      const fullName = user.full_name || 'No name provided';
      const joinedDate = new Date(user.created_at).toLocaleDateString();
      
      return `"${firstName}","${lastName}","${fullName}","${user.email}","${user.role}","${joinedDate}"`;
    }).join('\n');

    const csvData = csvHeaders + csvContent;

    // Create and trigger download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `marketing-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `Exported ${marketingSubscribers.length} marketing subscribers to CSV.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>View Marketing Subscribers</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Marketing Subscribers ({marketingSubscribers.length})</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Users who have opted into marketing communications
            </div>
            <Button 
              onClick={exportMarketingSubscribers}
              disabled={marketingSubscribers.length === 0}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingSubscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No marketing subscribers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    marketingSubscribers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {user.full_name || 'No name provided'}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : user.role === 'affiliate' ? 'secondary' : 'outline'}
                            className={
                              user.role === 'admin' 
                                ? 'bg-amber-500 hover:bg-amber-600 text-xs' 
                                : user.role === 'affiliate'
                                ? 'bg-[#060ede] hover:bg-[#050cc9] text-white text-xs'
                                : 'text-xs'
                            }
                          >
                            {user.role === 'admin' ? 'Administrator' : user.role === 'affiliate' ? 'Affiliate' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
