
import { CheckCircle, Clock, DollarSign, FileText, Shield, Users } from "lucide-react";

const ExpertValueBenefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Regulatory Expertise",
      description: "Navigate complex SBIR regulations, ITAR requirements, and technology transfer laws with confidence."
    },
    {
      icon: FileText,
      title: "Documentation Excellence",
      description: "Professional preparation of all required paperwork, contracts, and compliance documentation."
    },
    {
      icon: DollarSign,
      title: "Value Maximization",
      description: "Strategic positioning and pricing guidance to help you achieve optimal returns on your technology assets."
    },
    {
      icon: Users,
      title: "Network Access",
      description: "Leverage our extensive network of defense contractors, government agencies, and technology buyers."
    },
    {
      icon: Clock,
      title: "Accelerated Process",
      description: "Streamlined workflows that significantly reduce time-to-market and administrative overhead."
    },
    {
      icon: CheckCircle,
      title: "SBIR Strategy",
      description: "Our expertise is backed by over $500M in successful technology transfers and satisfied clients across the defense sector."
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        The Expert Advantage
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <div key={index} className="text-center p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExpertValueBenefits;
