
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ValidationAlertsProps {
  userAttempts: boolean;
  remainingTime: number;
  validationErrors: string[];
  spamScore: number;
}

const ValidationAlerts = ({ 
  userAttempts, 
  remainingTime, 
  validationErrors, 
  spamScore 
}: ValidationAlertsProps) => {
  return (
    <>
      {userAttempts && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Rate limit exceeded. Please wait {Math.ceil(remainingTime / 60)} minutes before submitting another listing.
          </AlertDescription>
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Content Issues Found:</div>
              <ul className="list-disc list-inside text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              {spamScore > 0 && (
                <div className="text-xs text-muted-foreground mt-2">
                  Spam score: {spamScore}/100
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ValidationAlerts;
