
import { Button } from "@/components/ui/button";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminListingsTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
  startItem: number;
  endItem: number;
}

const AdminListingsTablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
  hasNextPage,
  hasPreviousPage,
  totalItems,
  startItem,
  endItem,
}: AdminListingsTablePaginationProps) => {
  // Generate page numbers to show with responsive awareness
  const getPageNumbers = () => {
    const pages = [];
    // Show fewer pages on mobile (3) vs desktop (5)
    const maxPages = window.innerWidth < 640 ? 3 : 5;
    
    if (totalPages <= maxPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const delta = window.innerWidth < 640 ? 1 : 2;
      const start = Math.max(1, currentPage - delta);
      const end = Math.min(totalPages, currentPage + delta);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('ellipsis-start');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 py-4">
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      
      <div className="flex items-center justify-center sm:justify-start space-x-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={onPreviousPage}
                className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={onNextPage}
                className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Go to:</span>
          <Select value={currentPage.toString()} onValueChange={(value) => onPageChange(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <SelectItem key={page} value={page.toString()}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdminListingsTablePagination;
