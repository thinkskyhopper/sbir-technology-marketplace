
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Promotion {
  id: string;
  title: string;
  description: string;
  photo_url: string;
}

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard = ({ promotion }: PromotionCardProps) => {
  if (!promotion.title && !promotion.description && !promotion.photo_url) {
    return null;
  }

  return (
    <Card className="bg-background/50 border">
      <CardContent className="p-6">
        {/* Promotion Title at top */}
        {promotion.title && (
          <h4 className="text-lg font-semibold mb-4 text-primary text-center">
            {promotion.title}
          </h4>
        )}
        
        {/* Promotion Image in middle - maintain aspect ratio */}
        {promotion.photo_url && (
          <div className="mb-4">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={promotion.photo_url}
                alt={promotion.title || 'Promotion'}
                className="w-full h-full rounded-lg object-cover"
              />
            </AspectRatio>
          </div>
        )}
        
        {/* Promotion Description at bottom */}
        {promotion.description && (
          <p className="text-sm text-slate-50 leading-relaxed text-center">
            {promotion.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
