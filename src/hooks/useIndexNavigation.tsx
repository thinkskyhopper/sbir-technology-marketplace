
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { SBIRListing } from "@/types/listings";

export const useIndexNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExploreMarketplace = () => {
    console.log("Explore marketplace clicked");
    navigate("/?view=marketplace");
  };

  const handleSearch = (query: string) => {
    console.log("Search initiated:", query);
    const params = new URLSearchParams();
    params.set("view", "marketplace");
    if (query) {
      params.set("search", query);
    }
    navigate(`/?${params.toString()}`);
  };

  const handlePostListingClick = (setShowCreateDialog: (show: boolean) => void) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowCreateDialog(true);
  };

  const handleContactAdmin = (listing: SBIRListing) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // TODO: Implement contact admin functionality
    console.log("Contact admin for listing:", listing);
  };

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);

    // Build new URL with all filters
    const params = new URLSearchParams();
    params.set("view", "marketplace");
    if (filters.localSearchQuery) params.set("search", filters.localSearchQuery);
    if (filters.phaseFilter !== "all") params.set("phase", filters.phaseFilter);
    if (filters.categoryFilter !== "all") params.set("category", filters.categoryFilter);
    if (filters.statusFilter !== "all") params.set("status", filters.statusFilter);
    if (filters.sortFilter !== "newest") params.set("sort", filters.sortFilter);
    if (filters.typeFilter !== "all") params.set("type", filters.typeFilter);

    // Use replace to avoid creating history entries for filter changes
    navigate(`/?${params.toString()}`, {
      replace: true
    });
  };

  return {
    handleExploreMarketplace,
    handleSearch,
    handlePostListingClick,
    handleContactAdmin,
    handleFiltersChange
  };
};
