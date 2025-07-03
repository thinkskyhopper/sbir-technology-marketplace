
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import UserSettings from "@/pages/UserSettings";
import Bookmarks from "@/pages/Bookmarks";
import Admin from "@/pages/Admin";
import AdminUsers from "@/pages/AdminUsers";
import AdminListings from "@/pages/AdminListings";
import AdminChangeRequests from "@/pages/AdminChangeRequests";
import AdminCategoryImages from "@/pages/AdminCategoryImages";
import AdminLogs from "@/pages/AdminLogs";
import ListingDetail from "@/pages/ListingDetail";
import ExpertValue from "@/pages/ExpertValue";
import Team from "@/pages/Team";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import LegalDisclaimer from "@/pages/LegalDisclaimer";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/expert-value" element={<ExpertValue />} />
            <Route path="/team" element={<Team />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/listings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/change-requests"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminChangeRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/category-images"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminCategoryImages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLogs />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
