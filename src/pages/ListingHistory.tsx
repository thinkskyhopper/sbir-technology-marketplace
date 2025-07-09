
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, Building, User, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { SBIRListing } from "@/types/listings";

interface AuditLog {
  id: string;
  action_type: string;
  created_at: string;
  user_notes?: string;
  internal_notes?: string;
  changes_made?: any;
  admin_profile?: {
    full_name: string;
    email: string;
  };
}

const ListingHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const { data: listing, isLoading: listingLoading } = useQuery({
    queryKey: ['listing-history', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sbir_listings')
        .select(`
          *,
          profiles!fk_sbir_listings_user_id (
            full_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as SBIRListing;
    },
    enabled: !!id && isAdmin,
  });

  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['listing-audit-logs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select(`
          *,
          profiles!admin_audit_logs_admin_id_fkey (
            full_name,
            email
          )
        `)
        .eq('listing_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(log => ({
        ...log,
        admin_profile: log.profiles
      })) as AuditLog[];
    },
    enabled: !!id && isAdmin,
  });

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  if (listingLoading || logsLoading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Sold': return 'outline';
      case 'Rejected': return 'destructive';
      case 'Hidden': return 'secondary';
      default: return 'default';
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'approval': return 'Approved';
      case 'denial': return 'Rejected';
      case 'edit': return 'Edited';
      case 'deletion': return 'Deleted';
      default: return actionType;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/listings')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Listings</span>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Listing History</h1>
                <p className="text-muted-foreground">Complete history and details</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Listing Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Basic Information
                    <Badge variant={getStatusBadgeVariant(listing.status)}>
                      {listing.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                    <p className="text-muted-foreground">{listing.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Agency</p>
                        <p className="font-medium">{listing.agency}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-medium">${listing.value.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-medium">{formatDate(listing.deadline)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Phase</p>
                      <p className="font-medium">{listing.phase}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{listing.category}</p>
                  </div>
                  
                  {listing.technology_summary && (
                    <div>
                      <p className="text-sm text-muted-foreground">Technology Summary</p>
                      <p className="font-medium">{listing.technology_summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Admin-Only Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Administrative Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listing.agency_tracking_number && (
                      <div>
                        <p className="text-sm text-muted-foreground">Agency Tracking Number</p>
                        <p className="font-medium">{listing.agency_tracking_number}</p>
                      </div>
                    )}
                    
                    {listing.topic_code && (
                      <div>
                        <p className="text-sm text-muted-foreground">Topic Code</p>
                        <p className="font-medium">{listing.topic_code}</p>
                      </div>
                    )}
                    
                    {listing.company && (
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{listing.company}</p>
                      </div>
                    )}
                    
                    {listing.contract && (
                      <div>
                        <p className="text-sm text-muted-foreground">Contract</p>
                        <p className="font-medium">{listing.contract}</p>
                      </div>
                    )}
                    
                    {listing.proposal_award_date && (
                      <div>
                        <p className="text-sm text-muted-foreground">Proposal Award Date</p>
                        <p className="font-medium">{formatDate(listing.proposal_award_date)}</p>
                      </div>
                    )}
                    
                    {listing.contract_end_date && (
                      <div>
                        <p className="text-sm text-muted-foreground">Contract End Date</p>
                        <p className="font-medium">{formatDate(listing.contract_end_date)}</p>
                      </div>
                    )}
                  </div>
                  
                  {listing.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{listing.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              {(listing.primary_investigator_name || listing.business_contact_name) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {listing.primary_investigator_name && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Primary Investigator</span>
                        </h4>
                        <div className="ml-6 space-y-1">
                          <p className="font-medium">{listing.primary_investigator_name}</p>
                          {listing.pi_phone && (
                            <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{listing.pi_phone}</span>
                            </p>
                          )}
                          {listing.pi_email && (
                            <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{listing.pi_email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {listing.business_contact_name && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center space-x-2">
                          <Building className="w-4 h-4" />
                          <span>Business Contact</span>
                        </h4>
                        <div className="ml-6 space-y-1">
                          <p className="font-medium">{listing.business_contact_name}</p>
                          {listing.bc_phone && (
                            <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{listing.bc_phone}</span>
                            </p>
                          )}
                          {listing.bc_email && (
                            <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{listing.bc_email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Audit Logs */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail</CardTitle>
                </CardHeader>
                <CardContent>
                  {auditLogs && auditLogs.length > 0 ? (
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="border-l-2 border-muted pl-4 pb-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge variant="outline" className="mb-1">
                                {getActionTypeLabel(log.action_type)}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {formatDateTime(log.created_at)}
                              </p>
                            </div>
                            {log.admin_profile && (
                              <div className="text-right">
                                <p className="text-sm font-medium">{log.admin_profile.full_name}</p>
                                <p className="text-xs text-muted-foreground">{log.admin_profile.email}</p>
                              </div>
                            )}
                          </div>
                          
                          {log.user_notes && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-muted-foreground">User Notes:</p>
                              <p className="text-sm">{log.user_notes}</p>
                            </div>
                          )}
                          
                          {log.internal_notes && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-muted-foreground">Internal Notes:</p>
                              <p className="text-sm">{log.internal_notes}</p>
                            </div>
                          )}
                          
                          {log.changes_made && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Changes Made:</p>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(log.changes_made, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No audit logs available for this listing.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ListingHistory;
