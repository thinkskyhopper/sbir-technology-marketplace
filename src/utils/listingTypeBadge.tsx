import { Badge } from "@/components/ui/badge";

interface ListingTypeBadgeProps {
  type: 'Contract' | 'IP' | 'Contract & IP';
  className?: string;
}

export const ListingTypeBadge = ({ type, className = "" }: ListingTypeBadgeProps) => {
  const getTypeColor = () => {
    switch (type) {
      case 'Contract':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'IP':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'Contract & IP':
        return 'bg-indigo-500 hover:bg-indigo-600 text-white';
      default:
        return '';
    }
  };

  return (
    <Badge className={`${getTypeColor()} ${className}`}>
      {type}
    </Badge>
  );
};
