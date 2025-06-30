
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminChangeRequests from "./pages/AdminChangeRequests";
import AdminListings from "./pages/AdminListings";
import AdminCategoryImages from "./pages/AdminCategoryImages";
import ExpertValue from "./pages/ExpertValue";
import ListingDetail from "./pages/ListingDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalDisclaimer from "./pages/LegalDisclaimer";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/change-requests" element={<AdminChangeRequests />} />
            <Route path="/admin/listings" element={<AdminListings />} />
            <Route path="/admin/category-images" element={<AdminCategoryImages />} />
            <Route path="/expert-value" element={<ExpertValue />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
