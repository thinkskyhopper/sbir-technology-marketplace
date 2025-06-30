
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminUsersHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/admin');
  };

  return (
    <div className="flex items-center space-x-3 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={handleBackClick}
        className="mr-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <Users className="w-8 h-8 text-primary" />
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and view user statistics
        </p>
      </div>
    </div>
  );
};

export default AdminUsersHeader;
