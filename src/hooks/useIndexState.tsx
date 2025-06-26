
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useIndexState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Determine current view based on URL parameters
  const getCurrentView = (): "home" | "marketplace" => {
    return searchParams.get("view") === "marketplace" ? "marketplace" : "home";
  };
  const [currentView, setCurrentView] = useState<"home" | "marketplace">(getCurrentView());

  // Read filters from URL parameters
  const getFiltersFromURL = () => ({
    localSearchQuery: searchParams.get("search") || "",
    phaseFilter: searchParams.get("phase") || "all",
    categoryFilter: searchParams.get("category") || "all",
    statusFilter: searchParams.get("status") || "active",
    sortFilter: searchParams.get("sort") || "newest"
  });
  const [marketplaceFilters, setMarketplaceFilters] = useState(getFiltersFromURL());

  // Update view and filters when URL changes (including back/forward navigation)
  useEffect(() => {
    const newView = getCurrentView();
    const newFilters = getFiltersFromURL();
    console.log("URL changed - updating view to:", newView);
    setCurrentView(newView);
    setMarketplaceFilters(newFilters);

    // Update search query from URL
    const urlSearch = searchParams.get("search") || "";
    setSearchQuery(urlSearch);
  }, [searchParams]);

  return {
    searchQuery,
    setSearchQuery,
    currentView,
    setCurrentView,
    marketplaceFilters,
    setMarketplaceFilters,
    showCreateDialog,
    setShowCreateDialog
  };
};
