
import { TableCell } from "@/components/ui/table";

interface CurrencyCellProps {
  value: number;
}

const CurrencyCell = ({ value }: CurrencyCellProps) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TableCell className="text-right">
      <span className="text-sm font-medium">{formatCurrency(value)}</span>
    </TableCell>
  );
};

export default CurrencyCell;
