import { Checkbox } from "@/components/ui/checkbox";

interface BulkSelectionCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
  'aria-label'?: string;
}

const BulkSelectionCheckbox = ({ 
  checked, 
  onCheckedChange, 
  indeterminate = false,
  'aria-label': ariaLabel
}: BulkSelectionCheckboxProps) => {
  return (
    <Checkbox
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel || "Select all listings on this page"}
      className="translate-y-[2px]"
    />
  );
};

export default BulkSelectionCheckbox;