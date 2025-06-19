
import React from "react";
import { TeamMember } from "./TeamMembersList";
import { Card, CardContent } from "@/components/ui/card";
import PromotionCard from "./PromotionCard";

interface TeamMemberBioProps {
  member: TeamMember;
  isReversed: boolean;
}

const TeamMemberBio = ({ member, isReversed }: TeamMemberBioProps) => {
  // Create promotion cards from both new and legacy formats
  const promotions = [];
  
  // Add legacy promotion if it exists and no new promotions
  if (member.promotion_title || member.promotion_description || member.promotion_photo_url) {
    promotions.push({
      id: 'legacy-promotion',
      title: member.promotion_title || '',
      description: member.promotion_description || '',
      photo_url: member.promotion_photo_url || '',
    });
  }

  // TODO: When we add the promotions table, we'll fetch and display those here as well

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
