
import React from "react";
import { TeamMember } from "./TeamMembersList";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberBioProps {
  member: TeamMember;
  isReversed: boolean;
}

const TeamMemberBio = ({ member, isReversed }: TeamMemberBioProps) => {
  return (
    <Card className={`flex-1 ${isReversed ? 'bg-background/60' : 'bg-background/80'}`}>
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-4">{member.name}</h3>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {member.bio}
          </p>
        </div>

        {/* Promotion Section */}
        {member.promotion_title && (
          <div className="mt-8 p-6 rounded-lg bg-background/50 border">
            <div className="flex flex-col md:flex-row gap-6">
              {member.promotion_photo_url && (
                <div className="flex-shrink-0">
                  <img 
                    src={member.promotion_photo_url}
                    alt={member.promotion_title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2 text-primary">
                  {member.promotion_title}
                </h4>
                {member.promotion_description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.promotion_description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberBio;
