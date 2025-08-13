
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ListingDetailDescriptionProps {
  description: string;
}

const ListingDetailDescription = ({ description }: ListingDetailDescriptionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ListingDetailDescription;
