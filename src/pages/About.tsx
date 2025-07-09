
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="text-muted-foreground">
            Learn more about our SBIR marketplace platform
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We connect SBIR award winners with potential buyers, creating a marketplace 
            for innovative technologies and research outcomes.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="text-muted-foreground">
            Our platform enables researchers and companies to list their SBIR-funded 
            technologies, making it easier for organizations to discover and acquire 
            cutting-edge innovations.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
