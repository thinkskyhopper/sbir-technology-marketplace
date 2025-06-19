
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateListingDialog from '@/components/CreateListingDialog';
import GenericContactDialog from '@/components/GenericContactDialog';
import { useAuth } from '@/contexts/AuthContext';

const LegalDisclaimer = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePostListingClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowCreateDialog(true);
  };

  const handleContactUsClick = () => {
    setShowContactDialog(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onPostListingClick={handlePostListingClick} />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild className="mr-4">
              
            </Button>
            <div className="flex items-center">
              
              <h1 className="text-2xl font-bold">The SBIR Tech Marketplace Legal Disclaimer</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Legal Disclaimer</CardTitle>
              <p className="text-sm text-muted-foreground">Effective Date: December 2024</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
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
                  For questions or concerns, please{' '}
                  <button 
                    onClick={handleContactUsClick}
                    className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    contact us
                  </button>
                  .
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
      
      <CreateListingDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <GenericContactDialog open={showContactDialog} onOpenChange={setShowContactDialog} />
    </div>
  );
};

export default LegalDisclaimer;
