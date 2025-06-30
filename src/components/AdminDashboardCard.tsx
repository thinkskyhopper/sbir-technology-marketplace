
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminDashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  pendingCount?: number;
  pendingLabel?: string;
}

const AdminDashboardCard = ({
  title,
  description,
  icon: Icon,
  route,
  pendingCount,
  pendingLabel
}: AdminDashboardCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </div>
          </div>
          {pendingCount !== undefined && pendingCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {pendingCount} {pendingLabel}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>
        
        <Button 
          onClick={() => navigate(route)}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
        >
          <span>Manage {title}</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardCard;
