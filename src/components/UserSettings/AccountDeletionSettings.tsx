
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountDeletionSettings = () => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!user || confirmationText !== 'DELETE MY ACCOUNT') return;
    
    setIsDeleting(true);
    try {
      console.log('Starting account deletion process for user:', user.id);
      
      // Call the soft delete function
      const { data, error } = await supabase.rpc('soft_delete_user_account', {
        user_id_param: user.id
      });

      console.log('Soft delete result:', { data, error });

      if (error) {
        console.error('Error during soft deletion:', error);
        toast({
          title: "Error",
          description: "Failed to delete account. Please contact support if this problem persists.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.error('Soft delete returned false - account may not exist or already deleted');
        toast({
          title: "Error", 
          description: "Account could not be deleted. It may already be deleted or not exist.",
          variant: "destructive",
        });
        return;
      }

      console.log('Account successfully soft deleted');
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted. You will be signed out now.",
        variant: "default",
      });

      // Sign out the user after successful deletion
      setTimeout(async () => {
        await signOut();
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmationValid = confirmationText === 'DELETE MY ACCOUNT';

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="w-5 h-5" />
          Delete Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Warning: This action cannot be undone</p>
              <p className="text-sm text-muted-foreground mt-1">
                Deleting your account will remove your:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Profile and personal information</li>
                <li>Access to the platform</li>
                <li>Notification preferences</li>
                <li>Bookmarks</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3 font-medium">
                Note: Your submitted listings will be hidden, and change requests will be preserved for historical records, but you will no longer be able to modify them.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="confirmation" className="text-sm font-medium">
              To confirm account deletion, type "DELETE MY ACCOUNT" below:
            </Label>
            <Input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="mt-2"
              disabled={isDeleting}
            />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={!isConfirmationValid || isDeleting}
                className="w-full"
              >
                {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your access to the platform. Your listings and change requests
                  will be preserved for historical records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionSettings;
