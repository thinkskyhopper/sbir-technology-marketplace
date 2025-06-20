
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Promotion {
  id?: string;
  title?: string;
  description?: string;
  photo_url?: string;
  link_url?: string;
}

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard = ({ promotion }: PromotionCardProps) => {
  if (!promotion.title && !promotion.description && !promotion.photo_url) {
    return null;
  }

  const hasLink = promotion.link_url && promotion.link_url.trim() !== '';

  const TitleComponent = () => {
    const titleContent = (
      <h4 className={`text-lg font-semibold mb-4 text-center ${
        hasLink 
          ? 'text-primary underline hover:text-primary/80 transition-colors' 
          : 'text-slate-50'
      }`}>
        {promotion.title}
      </h4>
    );

    if (hasLink) {
      return (
        <a 
          href={promotion.link_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          {titleContent}
        </a>
      );
    }

    return titleContent;
  };

  const ImageComponent = () => {
    const imageContent = (
      <AspectRatio 
        ratio={16 / 9} 
        className={`rounded-lg ${
          hasLink 
            ? 'border-2 border-primary p-1 overflow-hidden' 
            : 'overflow-hidden'
        }`}
      >
        <img 
          src={promotion.photo_url}
          alt={promotion.title || 'Promotion'}
          className="w-full h-full object-contain rounded"
        />
      </AspectRatio>
    );

    if (hasLink) {
      return (
        <a 
          href={promotion.link_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          {imageContent}
        </a>
      );
    }

    return imageContent;
  };

  return (
    <Card className="bg-background/50 border">
      <CardContent className="p-6">
        {/* Promotion Title at top */}
        {promotion.title && <TitleComponent />}
        
        {/* Promotion Image in middle - maintaining aspect ratio */}
        {promotion.photo_url && (
          <div className="mb-4">
            <ImageComponent />
          </div>
        )}
        
        {/* Promotion Description at bottom */}
        {promotion.description && (
          <p className="text-sm text-muted-foreground leading-relaxed text-center whitespace-pre-wrap">
            {promotion.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
