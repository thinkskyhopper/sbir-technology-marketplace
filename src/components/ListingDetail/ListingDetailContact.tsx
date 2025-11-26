import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
interface ListingDetailContactProps {
  onContactAdmin: () => void;
}
const ListingDetailContact = ({
  onContactAdmin
}: ListingDetailContactProps) => {
  return <Card>
      <CardHeader>
        <CardTitle>Interested?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Send an inquiry to our team to learn more about this opportunity and discuss the acquisition process.</p>
        
        <Button className="w-full" onClick={onContactAdmin}>
          <Mail className="w-4 h-4 mr-2" />
          Contact
        </Button>
      </CardContent>
    </Card>;
};
export default ListingDetailContact;