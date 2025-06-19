
import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export const useSorting = <T extends Record<string, any>>(data: T[], initialSort?: SortState) => {
  const [sortState, setSortState] = useState<SortState>(
    initialSort || { column: null, direction: null }
  );

  const handleSort = (column: string) => {
    setSortState(prevState => {
      if (prevState.column === column) {
        // If clicking the same column, cycle through: asc -> desc -> null
        if (prevState.direction === 'asc') {
          return { column, direction: 'desc' };
        } else if (prevState.direction === 'desc') {
          return { column: null, direction: null };
        }
      }
      // New column or resetting, start with ascending
      return { column, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortState.column!];
      const bValue = b[sortState.column!];

      // Handle different data types
      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        // Convert to string for comparison
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortState.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, sortState]);

  return {
    sortedData,
    sortState,
    handleSort
  };
};
