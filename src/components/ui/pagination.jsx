// src\components\ui\pagination.jsx
'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems,
  itemsPerPage,
  onItemsPerPageChange, // Make sure this prop is received
  className 
}) => {
  const getVisiblePages = () => {
    // If total pages is 1 or less, just return [1]
    if (totalPages <= 1) {
      return [1];
    }

    // If total pages is 2, return [1, 2]
    if (totalPages === 2) {
      return [1, 2];
    }

    // If total pages is 3, return [1, 2, 3]
    if (totalPages === 3) {
      return [1, 2, 3];
    }

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always show first page
    rangeWithDots.push(1);

    // Add ellipsis if there's a gap between page 1 and the first page in range
    if (range[0] > 2) {
      rangeWithDots.push('...');
    }

    // Add the range of pages
    rangeWithDots.push(...range);

    // Add ellipsis if there's a gap between the last page in range and the last page
    if (range[range.length - 1] < totalPages - 1) {
      rangeWithDots.push('...');
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  return (
    <div className={cn("flex items-center justify-between px-2 py-4", className)}>
      {/* Items Info */}
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} projects
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  currentPage === page && "bg-blue-600 text-white"
                )}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <select 
            value={itemsPerPage} // Make it controlled
            onChange={handleItemsPerPageChange} // Use the handler
            className="bg-background border border-border rounded px-2 py-1 text-xs"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;