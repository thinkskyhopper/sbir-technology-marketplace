
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";

interface CalendlyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CalendlyDialog = ({ open, onOpenChange }: CalendlyDialogProps) => {
  useEffect(() => {
    if (open) {
      // Load Calendly script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup script when component unmounts
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <DialogTitle className="text-lg font-semibold">Schedule Your Free Consultation</DialogTitle>
          </div>
          <div className="flex-1 min-h-0">
            <div 
              className="calendly-inline-widget w-full h-full" 
              data-url="https://calendly.com/skyhopper/30min"
            ></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyDialog;
