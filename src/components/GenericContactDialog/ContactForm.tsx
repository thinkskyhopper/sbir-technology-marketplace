
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SecureCaptcha from "./SecureCaptcha";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  userEmail: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

const ContactForm = ({ open, onOpenChange, title, userEmail }: ContactFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCaptchaVerified) {
      toast({
        title: "Verification Required",
        description: "Please complete the security verification before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Additional bot detection - check for honeypot field
    const form = e.target as HTMLFormElement;
    const honeypot = form.querySelector('input[name="website"]') as HTMLInputElement;
    if (honeypot && honeypot.value) {
      // Bot detected - honeypot was filled
      toast({
        title: "Error",
        description: "Submission failed. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          listing: {
            id: "general-inquiry",
            title: "General Contact Form",
            agency: "N/A",
            value: 0,
            phase: "N/A"
          },
          userEmail,
          captchaVerified: isCaptchaVerified
        }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent to our team. We'll get back to you soon!",
        });
        onOpenChange(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          message: ""
        });
        setIsCaptchaVerified(false);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaVerification = (isVerified: boolean) => {
    setIsCaptchaVerified(isVerified);
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
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your interests or how we can help you..."
            />
          </div>

          <SecureCaptcha onVerificationChange={handleCaptchaVerification} />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !isCaptchaVerified}
              className={!isCaptchaVerified ? "opacity-50" : ""}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
