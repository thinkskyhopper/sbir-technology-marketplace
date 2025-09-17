
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, History, Check, X, EyeOff, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    isMobile ? (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isProcessing}
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-0">
          <DrawerHeader className="text-left">
            <DrawerTitle>Listing actions</DrawerTitle>
            <DrawerDescription>Manage this listing</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-2">
            {/* Basic Actions */}
            <Button variant="ghost" className="w-full justify-start" onClick={() => onEdit(listing)} disabled={isProcessing}>
              <Edit className="mr-2 h-4 w-4" />
              Edit listing
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(`/listing/${listing.id}/history`)}>
              <History className="mr-2 h-4 w-4" />
              View history
            </Button>

            {/* Approval Actions */}
            {listing.status === 'Pending' && (
              <>
                <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => onApprove(listing)} disabled={isProcessing}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve listing
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onReject(listing)} disabled={isProcessing}>
                  <X className="mr-2 h-4 w-4" />
                  Reject listing
                </Button>
              </>
            )}

            {/* Hide Action */}
            {(listing.status === 'Active' || listing.status === 'Sold') && (
              <Button variant="ghost" className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={() => onHide(listing)} disabled={isProcessing}>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide listing
              </Button>
            )}

            {/* Delete Action */}
            <Button variant="destructive" className="w-full justify-start" onClick={() => onDelete(listing)} disabled={isProcessing}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete listing
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    ) : (
      <DropdownMenu>
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
          sideOffset={8}
          alignOffset={isMobile ? -16 : 0}
          avoidCollisions={false}
          collisionPadding={16}
          sticky="partial"
          hideWhenDetached={true}
          className={`w-48 z-[999] max-w-[90vw] sm:max-w-48 ${isMobile ? 'data-[state=open]:animate-none' : ''}`}
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
    )
  );
};

export default AdminListingsTableActions;
