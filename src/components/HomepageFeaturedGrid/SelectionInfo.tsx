
interface SelectionInfoProps {
  selectedCount: number;
  maxSelections: number;
  displayedCount: number;
  totalCount: number;
}

const SelectionInfo = ({
  selectedCount,
  maxSelections,
  displayedCount,
  totalCount
}: SelectionInfoProps) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <p className="text-sm text-muted-foreground">
        {selectedCount} of {maxSelections} listings selected
      </p>
      <p className="text-sm text-muted-foreground">
        Showing {displayedCount} of {totalCount} listings
      </p>
    </div>
  );
};

export default SelectionInfo;
