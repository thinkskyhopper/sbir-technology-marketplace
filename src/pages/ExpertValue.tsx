
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Target, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

const ExpertValue = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Shield,
      title: "Risk Mitigation",
      description: "Our experts help identify potential pitfalls and ensure all compliance requirements are met, reducing transaction risks significantly."
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Years of experience allow our team to quickly identify the perfect contract matches based on your specific capabilities and goals."
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
      description: "Our proven track record and expert oversight ensure higher success rates for contract transfers and negotiations."
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "Free 30-minute assessment of your needs and objectives"
    },
    {
      step: "2",
      title: "Strategic Planning",
      description: "Develop a customized approach for your specific situation"
    },
    {
      step: "3",
      title: "Expert Execution",
      description: "Our team handles negotiations, paperwork, and compliance"
    },
    {
      step: "4",
      title: "Successful Transfer",
      description: "Complete the transaction with full legal and regulatory compliance"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-gradient">Expert Guidance</span>?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            SBIR contract transactions involve complex regulations, substantial paperwork, and significant financial implications. 
            Our expert team has successfully facilitated over $500M in contract transfers, ensuring smooth, compliant, and profitable transactions.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$500M+</div>
            <div className="text-muted-foreground">Contracts Facilitated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">30 Days</div>
            <div className="text-muted-foreground">Average Transaction Time</div>
          </div>
        </section>

        {/* Benefits Grid */}
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

        {/* Process Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Proven Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-xl">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <blockquote className="text-xl italic mb-4">
                "Working with the SBIR Exchange expert team transformed what could have been a 6-month nightmare 
                into a seamless 3-week process. Their knowledge of defense contracting regulations saved us both 
                time and money, while ensuring full compliance."
              </blockquote>
              <div className="text-muted-foreground">
                <strong>Sarah Johnson</strong>, CEO of Defense Innovations Inc.
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-secondary/20 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Schedule a free consultation with our SBIR experts and discover how we can help you 
            navigate your next contract transaction with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Schedule Free Consultation
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/')}>
              Explore Marketplace
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExpertValue;
