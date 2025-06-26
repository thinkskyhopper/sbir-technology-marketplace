import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SBIRListing } from "@/types/listings";

interface ContactAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing;
}

const ContactAdminDialog = ({ open, onOpenChange, listing }: ContactAdminDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interestLevel: "",
    experience: "",
    timeline: "",
    message: ""
  });

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      console.log('Sending contact inquiry...', {
        formData,
        listing: {
          id: listing.id,
          title: listing.title,
          agency: listing.agency,
          value: listing.value,
          phase: listing.phase
        },
        userEmail: user.email
      });

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          listing: {
            id: listing.id,
            title: listing.title,
            agency: listing.agency,
            value: listing.value,
            phase: listing.phase
          },
          userEmail: user.email
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Contact email sent successfully:', data);

      toast({
        title: "Message Sent",
        description: "Your inquiry has been sent to our team. We'll get back to you soon!",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        interestLevel: "",
        experience: "",
        timeline: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Sign In Required
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-6">
              Please sign in to contact our team about this SBIR technology.
            </p>
            <Button onClick={handleSignIn} className="w-full">
              Sign In to Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact - {listing.title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company">Company/Organization</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="interestLevel">Level of Interest *</Label>
            <Select value={formData.interestLevel} onValueChange={(value) => setFormData({ ...formData, interestLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your interest level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High - Ready to proceed immediately</SelectItem>
                <SelectItem value="medium">Medium - Evaluating options</SelectItem>
                <SelectItem value="low">Low - Just gathering information</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="experience">SBIR Experience *</Label>
            <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your SBIR experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No prior SBIR experience</SelectItem>
                <SelectItem value="some">Some SBIR experience</SelectItem>
                <SelectItem value="extensive">Extensive SBIR experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeline">Expected Timeline *</Label>
            <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
              <SelectTrigger>
                <SelectValue placeholder="When would you like to proceed?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediately</SelectItem>
                <SelectItem value="1-2weeks">Within 1-2 weeks</SelectItem>
                <SelectItem value="1month">Within 1 month</SelectItem>
                <SelectItem value="3months">Within 3 months</SelectItem>
                <SelectItem value="exploring">Just exploring options</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Additional Questions or Comments</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your specific interests or questions regarding this SBIR technology..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactAdminDialog;
