
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
import Terms from "./pages/Terms";
import Team from "./pages/Team";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalDisclaimer from "./pages/LegalDisclaimer";
import ExpertValue from "./pages/ExpertValue";
import ColorSwatches from "./pages/ColorSwatches";
import UserSettings from "./pages/UserSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true, // Enable reconnect for VPN users
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: (failureCount, error: any) => {
        // Enhanced retry logic for VPN users
        
        // Don't retry auth errors (401, 403)
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        
        // Don't retry most 4xx client errors except rate limiting
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
          return false;
        }
        
        // Extended retries for network errors and VPN-related issues
        const isNetworkError = error?.isNetworkError || 
                              error?.isVpnRelated ||
                              error?.message?.includes('fetch') ||
                              error?.message?.includes('network') ||
                              error?.name === 'TypeError';
        
        if (isNetworkError) {
          return failureCount < 5; // More retries for network issues
        }
        
        // Default retry logic
        return failureCount < 3;
      },
      retryDelay: (attemptIndex, error: any) => {
        // Exponential backoff with jitter for VPN users
        const baseDelay = 1000; // 1 second base
        const isNetworkError = error?.isNetworkError || error?.isVpnRelated;
        
        if (isNetworkError) {
          // Longer delays for network issues
          return Math.min(baseDelay * Math.pow(2, attemptIndex) + Math.random() * 1000, 30000);
        }
        
        return Math.min(baseDelay * Math.pow(1.5, attemptIndex), 10000);
      }
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
              <GoogleAnalyticsTracker />
              <SkipNavigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:profileId" element={<Profile />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/listing/:id/history" element={<ListingHistory />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/listings" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminListings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/change-requests" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminChangeRequests />
                  </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLogs />
                  </ProtectedRoute>
                } />
                <Route path="/admin/category-images" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminCategoryImages />
                  </ProtectedRoute>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
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
