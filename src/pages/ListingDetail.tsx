
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Building, ArrowLeft, Phone, Mail, Edit } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import EditListingDialog from "@/components/EditListingDialog";
import ContactAdminDialog from "@/components/ContactAdminDialog";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, loading } = useListings();
  const { user, isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const listing = listings.find(l => l.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Contract Not Found</h1>
          <p className="text-muted-foreground mb-4">The contract you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getListingImage = () => {
    const category = listing.category.toLowerCase();
    const agency = listing.agency.toLowerCase();
    
    if (category.includes('cyber') || category.includes('security')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (category.includes('software') || category.includes('ai') || category.includes('data')) {
      return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (category.includes('hardware') || category.includes('electronic')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (agency.includes('navy') || agency.includes('air force') || agency.includes('army')) {
      return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else {
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    }
  };

  const handleContactAdmin = () => {
    setShowContactDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={listing.phase === "Phase I" ? "default" : "secondary"}>
                  {listing.phase}
                </Badge>
                <Badge 
                  variant={listing.status === "Active" ? "default" : "outline"}
                  className={listing.status === "Active" ? "bg-green-600" : ""}
                >
                  {listing.status}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <Building className="w-4 h-4 mr-2" />
                {listing.agency}
              </div>
              
              <div className="flex items-center text-2xl font-bold text-green-600">
                <DollarSign className="w-6 h-6 mr-1" />
                {formatCurrency(listing.value)}
              </div>
            </div>
            
            <div className="ml-6 space-x-2">
              {isAdmin && (
                <Button 
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Listing
                </Button>
              )}
              <Button 
                size="lg"
                onClick={handleContactAdmin}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card>
              <CardContent className="p-0">
                <img 
                  src={getListingImage()} 
                  alt={`${listing.category} contract visualization`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">Phase</h4>
                    <p className="text-muted-foreground">{listing.phase}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Category</h4>
                    <p className="text-muted-foreground">{listing.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Agency</h4>
                    <p className="text-muted-foreground">{listing.agency}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Contract Value</h4>
                    <p className="text-muted-foreground font-semibold">{formatCurrency(listing.value)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle>Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  <div>
                    <p className="font-semibold">Deadline</p>
                    <p className="text-muted-foreground">{formatDate(listing.deadline)}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  <div>
                    <p className="font-semibold">Contract Value</p>
                    <p className="text-muted-foreground">{formatCurrency(listing.value)}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <Building className="w-4 h-4 mr-2 text-blue-500" />
                  <div>
                    <p className="font-semibold">Agency</p>
                    <p className="text-muted-foreground">{listing.agency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Interested?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Contact our admin team to learn more about this contract and discuss the acquisition process.
                </p>
                
                <Button 
                  className="w-full"
                  onClick={handleContactAdmin}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Admin
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  <p>• Verified contract details</p>
                  <p>• Expert guidance included</p>
                  <p>• Secure transaction process</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listed</span>
                    <span>{formatDate(listing.submitted_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-semibold text-red-600">{formatDate(listing.deadline)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={listing}
      />

      {/* Contact Dialog */}
      {listing && (
        <ContactAdminDialog
          open={showContactDialog}
          onOpenChange={setShowContactDialog}
          listing={listing}
        />
      )}
    </div>
  );
};

export default ListingDetail;
