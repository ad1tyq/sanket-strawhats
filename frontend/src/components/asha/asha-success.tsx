import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CheckCircle, Clock } from "lucide-react";

interface AshaSuccessProps {
  village: string;
  isOffline?: boolean;
  onNewReport: () => void;
}

export function AshaSuccess({ village, isOffline = false, onNewReport }: AshaSuccessProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Success Icon */}
        <div className="text-center">
          {isOffline ? (
            <Clock className="w-20 h-20 text-warning mx-auto mb-4" />
          ) : (
            <CheckCircle className="w-20 h-20 text-success mx-auto mb-4" />
          )}
        </div>

        {/* Success Message */}
        <Card className="p-6 shadow-card border-0 bg-card text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isOffline ? "Report Saved!" : "Thank You!"}
            </h2>
            <p className="text-muted-foreground">
              {isOffline 
                ? `Report for ${village} has been saved and will be sent when you are back online.`
                : `Report for ${village} has been submitted successfully.`
              }
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={onNewReport}
            className="w-full h-12 text-base font-medium"
          >
            Submit Another Report
          </Button>
          
          {isOffline && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Reports will be automatically sent when internet connection is restored
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}