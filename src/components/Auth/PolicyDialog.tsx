
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
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Effective Date: 9/15/2025</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              At the SBIR Tech Marketplace, we are dedicated to protecting your privacy and handling your personal information with care. This policy explains what information we collect, how we use and protect it, and your rights concerning that data. By using our services, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you create an account and interact with our platform, we collect information that helps us provide you with our services.
            </p>
            
            <h3 className="text-lg font-medium mb-3">Information You Provide Directly:</h3>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>• <strong>Account Information:</strong> Your first and last name, email address, and password. This is required for user authentication and communication.</li>
              <li>• <strong>Profile Information (Optional):</strong> We offer the option to provide additional details, such as a business or organization name and an email to be publicly displayed on your profile. This information is optional and is used to personalize your experience and help you connect with relevant parties.</li>
            </ul>

            <h3 className="text-lg font-medium mb-3 mt-4">Information We Collect Automatically:</h3>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>• <strong>Device and Usage Data:</strong> When you visit our website, we automatically collect certain technical information. This includes your IP address, browser type, device information, and details about your interaction with our site, such as the pages you view and the time spent on them. We use this data to analyze trends, improve our platform's functionality, and ensure security.</li>
              <li>• <strong>Cookies and Other Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience. These technologies help us remember your preferences, keep you logged in, and analyze how our website is used. You can manage your cookie preferences through your browser settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>• <strong>To Provide and Improve Our Services:</strong> We use your personal information to create and manage your account, provide access to our marketplace, and respond to your requests. We also analyze this data to improve our platform's features and user experience.</li>
              <li>• <strong>For Communication:</strong> We use your email address to send you service-related communications, such as account confirmations, password reset instructions, and important updates about the marketplace.</li>
              <li>• <strong>To Maintain Security:</strong> We use your information to monitor for and prevent fraudulent activity, unauthorized access, and other security risks.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Sharing Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We are committed to never selling, renting, or trading your personal data with third-party marketers or advertisers. However, we may share your information in the following limited circumstances:
            </p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>• <strong>With Service Providers:</strong> We work with a small number of trusted third-party service providers who assist us with essential functions like website hosting, data storage, security, and analytics. These providers are bound by strict confidentiality agreements and are only permitted to use your information to perform the services we've hired them for.</li>
              <li>• <strong>For Legal and Security Purposes:</strong> We may disclose your information if required by law or in good faith belief that such action is necessary to comply with a legal obligation, protect our rights or property, or ensure the safety of our users or the public.</li>
              <li>• <strong>With Your Consent:</strong> We may share your information for any other purpose you have explicitly consented to.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Your Data Rights and Choices</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We believe you should have control over your personal information. You have the right to:
            </p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>• <strong>Access and Update Your Data:</strong> You can log into your account at any time to access and update the personal information you have provided.</li>
              <li>• <strong>Request Deletion:</strong> You have the right to request that we delete your personal information. We will honor your request unless we have a legal or legitimate business reason to retain it.</li>
              <li>• <strong>Object to Processing:</strong> You can object to our processing of your personal information in certain situations.</li>
              <li>• <strong>Opt-Out of Communications:</strong> If we send you promotional emails, you can opt out at any time by turning off marketing communications in your user settings. Please note that you may still receive essential service-related messages even after unsubscribing from promotional communications.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise any of these rights, please contact us via the contact form.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide our services. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this policy periodically to reflect changes in our data practices or to comply with new legal requirements. When we make significant changes, we will notify you by posting a new effective date at the top of the policy or through other prominent notices on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions, comments, or concerns about this privacy policy or our data practices, please contact us via the contact form.
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
