
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Terms and conditions for using our platform
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6">
            By accessing and using this platform, you accept and agree to be bound by the 
            terms and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Use License</h2>
          <p className="text-muted-foreground mb-6">
            Permission is granted to use this platform for personal and commercial purposes 
            in accordance with these terms of service.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
          <p className="text-muted-foreground">
            Users are responsible for maintaining the confidentiality of their account 
            information and for all activities that occur under their account.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
