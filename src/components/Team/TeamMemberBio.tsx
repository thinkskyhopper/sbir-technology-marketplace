
import React from "react";
import { TeamMember } from "./TeamMembersList";
import { Card, CardContent } from "@/components/ui/card";
import PromotionCard from "./PromotionCard";

interface TeamMemberBioProps {
  member: TeamMember;
  isReversed: boolean;
}

const TeamMemberBio = ({ member, isReversed }: TeamMemberBioProps) => {
  // Create promotion cards from new promotions array if it exists
  // If no new promotions, fall back to legacy format for backward compatibility
  const promotions = [];
  
  // Check if this member has new promotions data (future functionality)
  // For now, we'll only use legacy promotion if it exists
  if (member.promotion_title || member.promotion_description || member.promotion_photo_url) {
    promotions.push({
      id: 'legacy-promotion',
      title: member.promotion_title || '',
      description: member.promotion_description || '',
      photo_url: member.promotion_photo_url || '',
    });
  }

  // TODO: When we add the promotions relationship, we'll add those here:
  // if (member.promotions && member.promotions.length > 0) {
  //   promotions.push(...member.promotions);
  // }

  return (
    <Card className={`flex-1 ${isReversed ? 'bg-secondary/80' : 'bg-card/90'}`}>
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-4">{member.name}</h3>
        <div className="prose prose-lg max-w-none">
          <p className="text-slate-50 leading-relaxed whitespace-pre-wrap">
            {member.bio}
          </p>
        </div>

        {/* Promotions Section */}
        {promotions.length > 0 && (
          <div className="mt-8">
            <div className={`grid gap-6 ${promotions.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {promotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberBio;
