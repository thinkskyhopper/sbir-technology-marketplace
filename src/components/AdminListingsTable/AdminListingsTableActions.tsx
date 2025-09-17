
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import BasicActions from "./AdminListingsTableActions/BasicActions";
import ApprovalActions from "./AdminListingsTableActions/ApprovalActions";
import HideAction from "./AdminListingsTableActions/HideAction";
import DeleteAction from "./AdminListingsTableActions/DeleteAction";
import type { AdminListingsTableActionsProps } from "./AdminListingsTableActions/types";

const AdminListingsTableActions = ({
  listing,
  isProcessing,
  onEdit,
  onApprove,
  onReject,
  onHide,
  onDelete,
}: AdminListingsTableActionsProps) => {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isProcessing}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="bottom"
        sideOffset={6}
        className={`w-48 z-[999] max-w-[90vw] sm:max-w-48`}
      >
        <BasicActions 
          listing={listing} 
          isProcessing={isProcessing} 
          onEdit={onEdit}
        />

        <ApprovalActions
          listing={listing}
          isProcessing={isProcessing}
          onApprove={onApprove}
          onReject={onReject}
        />

        <HideAction
          listing={listing}
          isProcessing={isProcessing}
          onHide={onHide}
        />

        <DeleteAction
          listing={listing}
          isProcessing={isProcessing}
          onDelete={onDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminListingsTableActions;
