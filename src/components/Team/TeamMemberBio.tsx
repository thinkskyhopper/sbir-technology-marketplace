
import React from "react";
import { TeamMember } from "./TeamMembersList";
import { Card, CardContent } from "@/components/ui/card";
import PromotionCard from "./PromotionCard";

interface TeamMemberBioProps {
  member: TeamMember;
  isReversed: boolean;
}

const TeamMemberBio = ({ member, isReversed }: TeamMemberBioProps) => {
  // Use promotions from the new promotions array, ensuring it's always an array
  const promotions = Array.isArray(member.promotions) ? member.promotions : [];

  console.log('TeamMemberBio rendering with promotions:', promotions);

  return (
    <Card className={`flex-1 ${isReversed ? 'bg-secondary/80' : 'bg-card/90'}`}>
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-4 text-gradient">{member.name}</h3>
        <div className="prose prose-lg max-w-none">
          <p className="text-slate-50 leading-relaxed whitespace-pre-wrap">
            {member.bio}
          </p>
        </div>

        {/* Promotions Section */}
        {promotions.length > 0 && (
          <div className="mt-8">
            <div className={`grid gap-6 ${promotions.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {promotions.map((promotion, index) => (
                <PromotionCard key={promotion.id || `promotion-${index}`} promotion={promotion} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberBio;
