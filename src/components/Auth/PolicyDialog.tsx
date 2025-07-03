
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
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              At the SBIR Tech Marketplace, we value your privacy and are committed to protecting the personal information you share with us. When you engage with our services, we may collect basic details such as your name, email address, and business or organization name. This information is used strictly to support our communication with you, provide you with the services you've requested, and ensure the overall functionality and personalization of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Data Sharing and Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We want to be clear: your personal data is never sold, traded, or shared with third-party marketers or advertisers. We may work with a limited number of trusted service providers who help us operate our services, but any such relationship is governed by strong confidentiality obligations and data protection safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Security and Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our team applies industry-standard security measures to keep your data safe, and we retain your information only as long as needed to serve the purposes outlined above or as required by law. You have the right to access, update, or delete your personal information at any time, and we encourage you to contact us if you have questions about how your data is used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Policy Updates</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this policy from time to time to reflect changes in our practices or legal requirements, and we'll make those changes clear on our website. For any concerns or requests related to your privacy, feel free to reach out to us via the contact form.
            </p>
          </section>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <section>
          <p className="text-muted-foreground leading-relaxed">
            The SBIR Tech Marketplace (the "Platform") is provided for informational and transactional purposes only and does not constitute legal, financial, or professional advice. The Platform facilitates the listing, marketing, and potential transfer of Small Business Innovation Research (SBIR) and Small Business Technology Transfer (STTR) awards, contracts, or related intellectual property. Users of the Platform are responsible for ensuring compliance with all applicable federal, state, and local laws, regulations, and policies, including but not limited to those governing federal contracting, SBIR/STTR program requirements, and successor-in-interest transfers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">No Legal or Financial Advice</h2>
          <p className="text-muted-foreground leading-relaxed">
            The content, listings, and services provided through the Platform are not intended to serve as legal, financial, or professional advice. Users should consult with qualified legal counsel, financial advisors, or other professionals before engaging in any transactions or activities related to SBIR/STTR awards or transfers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Compliance with Federal Regulations</h2>
          <p className="text-muted-foreground leading-relaxed">
            Any transfer of SBIR/STTR awards or contracts, including successor-in-interest arrangements, must comply with the Federal Acquisition Regulation (FAR), agency-specific SBIR/STTR policies, and other applicable federal regulations. Users are solely responsible for obtaining necessary approvals from the awarding agency, including but not limited to novation agreements under FAR Subpart 42.12, and for ensuring that all conditions for transfer, such as eligibility and performance capability, are met.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Accuracy of Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            The SBIR Tech Marketplace does not guarantee the accuracy, completeness, or reliability of any information provided on the Platform, including listings, valuations, or representations made by sellers, buyers, or other users. Users are responsible for conducting their own due diligence and verifying all information before entering into any transaction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">No Endorsement</h2>
          <p className="text-muted-foreground leading-relaxed">
            The inclusion of any listing, company, or individual on the Platform does not constitute an endorsement, recommendation, or warranty by The SBIR Tech Marketplace regarding the quality, legitimacy, or suitability of any SBIR/STTR award, contract, or party involved in a transaction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Liability Limitation</h2>
          <p className="text-muted-foreground leading-relaxed">
            The SBIR Tech Marketplace, its owners, operators, affiliates, and employees shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of the Platform, including but not limited to losses related to transactions, regulatory non-compliance, or disputes between users. Users engage with the Platform at their own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Platform may include links to third-party websites, services, or resources. The SBIR Tech Marketplace is not responsible for the content, availability, or actions of such third parties, and users access these resources at their own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Disputes</h2>
          <p className="text-muted-foreground leading-relaxed">
            Any disputes arising from transactions or interactions facilitated by the Platform are the sole responsibility of the parties involved. The SBIR Tech Marketplace is not obligated to mediate, arbitrate, or resolve such disputes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Changes to Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The SBIR Tech Marketplace reserves the right to modify this disclaimer at any time without prior notice. Users are encouraged to review this disclaimer periodically.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            By using The SBIR Tech Marketplace, you acknowledge and agree to the terms of this disclaimer. If you do not agree, you should not use the Platform.
          </p>
        </section>

        <section>
          <p className="text-muted-foreground leading-relaxed">
            For questions or concerns, please contact us through our website or email us directly.
          </p>
        </section>
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
