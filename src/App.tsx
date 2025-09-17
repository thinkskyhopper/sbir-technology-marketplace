
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import SkipNavigation from "./components/SkipNavigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import ListingDetail from "./pages/ListingDetail";
import ListingHistory from "@/pages/ListingHistory";
import Admin from "./pages/Admin";
import AdminListings from "./pages/AdminListings";
import AdminUsers from "./pages/AdminUsers";
import AdminChangeRequests from "./pages/AdminChangeRequests";
import AdminLogs from "./pages/AdminLogs";
import AdminCategoryImages from "./pages/AdminCategoryImages";
import Bookmarks from "./pages/Bookmarks";
import MyListings from "./pages/MyListings";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Team from "./pages/Team";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalDisclaimer from "./pages/LegalDisclaimer";
import ExpertValue from "./pages/ExpertValue";
import ColorSwatches from "./pages/ColorSwatches";
import UserSettings from "./pages/UserSettings";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SkipNavigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/listing/:id/history" element={<ListingHistory />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/listings" element={<AdminListings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/change-requests" element={<AdminChangeRequests />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
                <Route path="/admin/category-images" element={<AdminCategoryImages />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/team" element={<Team />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />
                <Route path="/expert-value" element={<ExpertValue />} />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <UserSettings />
                  </ProtectedRoute>
                } />
                <Route path="/color-swatches" element={
                  <ProtectedRoute requireAdmin={true}>
                    <ColorSwatches />
                  </ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
