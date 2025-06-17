
import { Card, CardContent } from "@/components/ui/card";

const ExpertValueTestimonial = () => {
  return (
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
  );
};

export default ExpertValueTestimonial;
