
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateListingDialog from '@/components/CreateListingDialog';
import { useAuth } from '@/contexts/AuthContext';

const PrivacyPolicy = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePostListingClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowCreateDialog(true);
  };

  return <div className="min-h-screen bg-background flex flex-col">
      <Header onPostListingClick={handlePostListingClick} />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild className="mr-4">
              
            </Button>
            <div className="flex items-center">
              
              <h1 className="text-2xl font-bold">The SBIR Tech Marketplace Privacy Policy</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              
            </CardHeader>
            
            <CardContent className="space-y-6">
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
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may update this policy from time to time to reflect changes in our practices or legal requirements, and we'll make those changes clear on our website. For any concerns or requests related to your privacy, feel free to reach out to us via the contact form.
                </p>
                
                
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
      
      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>;
};
export default PrivacyPolicy;
