
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
              <CardTitle>Privacy Policy for SBIR Tech Marketplace</CardTitle>
              <p className="text-sm text-muted-foreground">Effective Date: 9/15/2025</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                At the SBIR Tech Marketplace, we are dedicated to protecting your privacy and handling your personal information with care. This policy explains what information we collect, how we use and protect it, and your rights concerning that data. By using our services, you agree to the practices described in this policy.
              </p>

              <section>
                <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account and interact with our platform, we collect information that helps us provide you with our services.
                </p>
                
                <h3 className="text-lg font-medium mb-3">Information You Provide Directly:</h3>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li><strong>Account Information:</strong> Your first and last name, email address, and password. This is required for user authentication and communication.</li>
                  <li><strong>Profile Information (Optional):</strong> We offer the option to provide additional details, such as a business or organization name and an email to be publicly displayed on your profile. This information is optional and is used to personalize your experience and help you connect with relevant parties.</li>
                </ul>

                <h3 className="text-lg font-medium mb-3">Information We Collect Automatically:</h3>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>Device and Usage Data:</strong> When you visit our website, we automatically collect certain technical information. This includes your IP address, browser type, device information, and details about your interaction with our site, such as the pages you view and the time spent on them. We use this data to analyze trends, improve our platform's functionality, and ensure security.</li>
                  <li><strong>Cookies and Other Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience. These technologies help us remember your preferences, keep you logged in, and analyze how our website is used. You can manage your cookie preferences through your browser settings.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>To Provide and Improve Our Services:</strong> We use your personal information to create and manage your account, provide access to our marketplace, and respond to your requests. We also analyze this data to improve our platform's features and user experience.</li>
                  <li><strong>For Communication:</strong> We use your email address to send you service-related communications, such as account confirmations, password reset instructions, and important updates about the marketplace.</li>
                  <li><strong>To Maintain Security:</strong> We use your information to monitor for and prevent fraudulent activity, unauthorized access, and other security risks.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. Sharing Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are committed to never selling, renting, or trading your personal data with third-party marketers or advertisers. However, we may share your information in the following limited circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>With Service Providers:</strong> We work with a small number of trusted third-party service providers who assist us with essential functions like website hosting, data storage, security, and analytics. These providers are bound by strict confidentiality agreements and are only permitted to use your information to perform the services we've hired them for.</li>
                  <li><strong>For Legal and Security Purposes:</strong> We may disclose your information if required by law or in good faith belief that such action is necessary to comply with a legal obligation, protect our rights or property, or ensure the safety of our users or the public.</li>
                  <li><strong>With Your Consent:</strong> We may share your information for any other purpose you have explicitly consented to.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. Your Data Rights and Choices</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We believe you should have control over your personal information. You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li><strong>Access and Update Your Data:</strong> You can log into your account at any time to access and update the personal information you have provided.</li>
                  <li><strong>Request Deletion:</strong> You have the right to request that we delete your personal information. We will honor your request unless we have a legal or legitimate business reason to retain it.</li>
                  <li><strong>Object to Processing:</strong> You can object to our processing of your personal information in certain situations.</li>
                  <li><strong>Opt-Out of Communications:</strong> If we send you promotional emails, you can opt out at any time by turning off marketing communications in your user settings. Please note that you may still receive essential service-related messages even after unsubscribing from promotional communications.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
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
