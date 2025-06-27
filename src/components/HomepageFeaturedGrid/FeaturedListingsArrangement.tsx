
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SBIRListing } from '@/types/listings';

interface FeaturedListingsArrangementProps {
  selectedListings: SBIRListing[];
  onReorder: (listings: SBIRListing[]) => void;
}

const FeaturedListingsArrangement = ({
  selectedListings,
  onReorder
}: FeaturedListingsArrangementProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedListings);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const handleRemove = (listingId: string) => {
    onReorder(selectedListings.filter(l => l.id !== listingId));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 pb-4 border-b">
        <h3 className="font-medium mb-2">Selected Featured Listings</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop to reorder. The first 6 listings will be displayed on the homepage.
        </p>
      </div>

      {selectedListings.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No listings selected</p>
            <p className="text-sm text-muted-foreground">
              Go to the "Select Listings" tab to choose featured listings
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="featured-listings">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 ${
                    snapshot.isDraggingOver ? 'bg-muted/20' : ''
                  }`}
                >
                  {selectedListings.map((listing, index) => (
                    <Draggable
                      key={listing.id}
                      draggableId={listing.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center space-x-3 p-4 border rounded-lg bg-background ${
                            snapshot.isDragging ? 'shadow-lg' : 'hover:bg-muted/50'
                          } ${index >= 6 ? 'opacity-60' : ''}`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-muted-foreground">
                                #{index + 1}
                              </span>
                              <h4 className="font-medium truncate">{listing.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {listing.phase}
                              </Badge>
                              {index >= 6 && (
                                <Badge variant="secondary" className="text-xs">
                                  Not displayed
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{listing.agency}</span>
                              <span>${listing.value.toLocaleString()}</span>
                              <span>{listing.category}</span>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(listing.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      )}
    </div>
  );
};

export default FeaturedListingsArrangement;
