import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";

const ExpertValueBenefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Risk Mitigation",
      description: "Our experts help identify potential pitfalls and ensure all compliance requirements are met, reducing transaction risks significantly."
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Years of experience allow our team to quickly identify the perfect technology matches based on your specific capabilities and goals."
    },
    {
      icon: Clock,
      title: "Time Efficiency",
      description: "Navigate complex SBIR regulations and paperwork in weeks instead of months with expert guidance every step of the way."
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Access insider knowledge about market trends, pricing strategies, and upcoming opportunities in the defense sector."
    },
    {
      icon: Users,
      title: "Network Access",
      description: "Leverage our extensive network of contractors, agencies, and industry professionals to expand your business opportunities."
    },
    {
      icon: CheckCircle,
      title: "Success Guarantee",
      description: "Our proven track record and expert oversight ensure higher success rates for technology transfers and negotiations."
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">The Expert Advantage</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                {benefit.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExpertValueBenefits;
