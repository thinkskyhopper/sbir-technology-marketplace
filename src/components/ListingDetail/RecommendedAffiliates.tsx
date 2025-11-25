import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";
interface RecommendedAffiliatesProps {
  listing: SBIRListing;
  isAuthenticated: boolean;
}
const RecommendedAffiliates = ({
  listing,
  isAuthenticated
}: RecommendedAffiliatesProps) => {
  const navigate = useNavigate();
  const affiliates = [listing.recommended_affiliate_1, listing.recommended_affiliate_2]
    .filter(Boolean)
    .sort((a, b) => {
      // Extract last name (last word in full_name)
      const getLastName = (name: string | null) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        return parts[parts.length - 1].toLowerCase();
      };
      
      const lastNameA = getLastName(a?.full_name);
      const lastNameB = getLastName(b?.full_name);
      
      return lastNameA.localeCompare(lastNameB);
    });
  if (affiliates.length === 0) {
    return null;
  }
  if (!isAuthenticated) {
    return <Card>
      <CardHeader>
        <CardTitle>Recommended Experts</CardTitle>
      </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to view our recommended experts for this listing.
          </p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </CardContent>
      </Card>;
  }
  return <Card>
    <CardHeader>
      <CardTitle>Recommended Affiliates</CardTitle>
    </CardHeader>
      <CardContent className="space-y-4">
        {affiliates.map(affiliate => {
        if (!affiliate) return null;
        const initials = affiliate.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
        return <a key={affiliate.id} href="https://meetings-na2.hubspot.com/ted-dennis?uuid=9776be4c-750d-43bc-bd54-bd23de8a0b4e" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 py-4 px-2 rounded-lg border border-border hover:bg-accent transition-colors">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-[#006ede] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-center hover:text-primary">
                {affiliate.full_name || 'Unnamed Expert'}
              </span>
            </a>;
      })}
      </CardContent>
    </Card>;
};
export default RecommendedAffiliates;