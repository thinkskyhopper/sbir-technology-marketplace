
import { Card, CardContent } from "@/components/ui/card";

const ExpertValueTestimonial = () => {
  return (
    <section className="mb-16">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <blockquote className="text-xl italic mb-4">
            "Ted Dennis and his team at SBIR Connect and The SBIR Tech Marketplace have been phenomenal partners for AT Corp. Over the past four months, Ted has successfully brokered seven SBIRs for us with two more in the pipeline. Thus showcasing his expertise, dedication, and unparalleled market knowledge. His ability to connect our innovative technologies with the right buyers has been a game-changer for our business. If you're looking to navigate the SBIR landscape with confidence, Ted and his platform are the absolute best in the business!"
          </blockquote>
          <div className="text-muted-foreground">
            <strong>Ken Thurber</strong>, Owner, Architecture Technology Corporation
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ExpertValueTestimonial;
