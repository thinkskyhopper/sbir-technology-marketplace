
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  userEmail: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  howDidYouFindUs: string;
  otherSource: string;
  message: string;
  honeypot: string; // Hidden field to catch bots
}

const ContactForm = ({ open, onOpenChange, title, userEmail }: ContactFormProps) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    email: profile?.email || "",
    company: "",
    howDidYouFindUs: "",
    otherSource: "",
    message: "",
    honeypot: ""
  });

  // Update form when profile data is available
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || ""
      }));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot field - if filled, it's likely a bot
    if (formData.honeypot.trim() !== "") {
      toast({
        title: "Error",
        description: "Spam detected. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Sending generic contact form...', {
        formData,
        userEmail
      });

      // Combine first and last name for the email
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const howDidYouFindUs = formData.howDidYouFindUs === "Other (Please specify)" 
        ? `Other: ${formData.otherSource}` 
        : formData.howDidYouFindUs;

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: fullName,
          email: formData.email,
          company: formData.company,
          howDidYouFindUs: howDidYouFindUs,
          message: formData.message,
          listing: {
            id: "general-inquiry",
            title: "General Contact Form",
            agency: "N/A",
            value: 0,
            phase: "N/A"
          },
          userEmail
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Generic contact email sent successfully:', data);

      toast({
        title: "Message Sent",
        description: "Your message has been sent to our team. We'll get back to you soon!",
      });
      onOpenChange(false);
      setFormData({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        email: profile?.email || "",
        company: "",
        howDidYouFindUs: "",
        otherSource: "",
        message: "",
        honeypot: ""
      });
    } catch (error: any) {
      console.error('Generic contact form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website">Website (leave blank):</label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
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

          <div>
            <Label htmlFor="company">Company/Organization</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="howDidYouFindUs">How did you hear about us? *</Label>
            <Select value={formData.howDidYouFindUs} onValueChange={(value) => setFormData({ ...formData, howDidYouFindUs: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Please select how you heard about us" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Podcast">Podcast</SelectItem>
                <SelectItem value="Word of mouth">Word of mouth</SelectItem>
                <SelectItem value="Other (Please specify)">Other (Please specify)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.howDidYouFindUs === "Other (Please specify)" && (
            <div>
              <Label htmlFor="otherSource">Please specify *</Label>
              <Input
                id="otherSource"
                value={formData.otherSource}
                onChange={(e) => setFormData({ ...formData, otherSource: e.target.value })}
                placeholder="Please tell us how you heard about us"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your interests or how we can help you..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
