
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: 'privacy' | 'legal';
}

const PolicyDialog = ({ open, onOpenChange, title, type }: PolicyDialogProps) => {
  const getContent = () => {
    if (type === 'privacy') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Information We Collect</h3>
          <p className="text-sm text-muted-foreground">
            We collect information you provide directly to us, such as when you create an account, 
            submit listings, or contact us for support.
          </p>
          
          <h3 className="text-lg font-semibold">How We Use Your Information</h3>
          <p className="text-sm text-muted-foreground">
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, and communicate with you.
          </p>
          
          <h3 className="text-lg font-semibold">Information Sharing</h3>
          <p className="text-sm text-muted-foreground">
            We do not sell, trade, or rent your personal information to third parties. 
            We may share your information only in specific circumstances outlined in this policy.
          </p>
          
          <h3 className="text-lg font-semibold">Data Security</h3>
          <p className="text-sm text-muted-foreground">
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h3 className="text-lg font-semibold">Your Rights</h3>
          <p className="text-sm text-muted-foreground">
            You have the right to access, update, or delete your personal information. 
            You may also opt out of certain communications from us.
          </p>
          
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="text-sm text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us through 
            our website or email us directly.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">General Disclaimer</h3>
        <p className="text-sm text-muted-foreground">
          The information on this website is provided on an "as is" basis. To the fullest extent 
          permitted by law, we exclude all representations, warranties, and conditions relating to 
          our website and the use of this website.
        </p>
        
        <h3 className="text-lg font-semibold">Limitation of Liability</h3>
        <p className="text-sm text-muted-foreground">
          We will not be liable for any consequential, incidental, indirect, or special damages 
          arising out of or in connection with your use of our website or services.
        </p>
        
        <h3 className="text-lg font-semibold">User Responsibilities</h3>
        <p className="text-sm text-muted-foreground">
          Users are responsible for ensuring that any information they provide is accurate and 
          up-to-date. Users must comply with all applicable laws and regulations.
        </p>
        
        <h3 className="text-lg font-semibold">Third-Party Links</h3>
        <p className="text-sm text-muted-foreground">
          Our website may contain links to third-party websites. We are not responsible for 
          the content or privacy practices of these external sites.
        </p>
        
        <h3 className="text-lg font-semibold">Changes to Terms</h3>
        <p className="text-sm text-muted-foreground">
          We reserve the right to modify these terms at any time. Changes will be effective 
          immediately upon posting on our website.
        </p>
        
        <h3 className="text-lg font-semibold">Governing Law</h3>
        <p className="text-sm text-muted-foreground">
          These terms are governed by and construed in accordance with applicable laws. 
          Any disputes will be resolved in the appropriate courts.
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please review the following {type === 'privacy' ? 'privacy policy' : 'legal disclaimer'} carefully.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {getContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyDialog;
