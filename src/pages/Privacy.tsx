
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            How we collect, use, and protect your information
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-muted-foreground mb-6">
            We collect information you provide directly to us, such as when you create an account, 
            submit listings, or contact us for support.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-6">
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, and communicate with you.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
