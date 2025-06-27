
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  localSearchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const SearchInput = ({ localSearchQuery, onSearchQueryChange }: SearchInputProps) => {
  // Local state for search input to maintain user input during typing
  const [searchInputValue, setSearchInputValue] = useState(localSearchQuery);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only update search input value when not actively typing AND the external value is different
  useEffect(() => {
    if (!isUserTyping && localSearchQuery !== searchInputValue) {
      console.log('Updating search input from external:', localSearchQuery);
      setSearchInputValue(localSearchQuery);
    }
  }, [localSearchQuery, isUserTyping, searchInputValue]);

  const handleSearchInputChange = (value: string) => {
    console.log('Search input changed:', value);
    setSearchInputValue(value);
    setIsUserTyping(true);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      console.log('Debounced search triggered:', value);
      onSearchQueryChange(value);
      setIsUserTyping(false);
    }, 300);
  };

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear timeout and immediately update search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    console.log('Form submitted with search:', searchInputValue);
    onSearchQueryChange(searchInputValue);
    setIsUserTyping(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex-1">
      <form onSubmit={handleLocalSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchInputValue}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          className="pl-10"
        />
      </form>
    </div>
  );
};

export default SearchInput;
