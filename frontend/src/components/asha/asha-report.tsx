import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CloudOff, Minus, Plus, Check } from "lucide-react";
import Image from "next/image";

interface AshaReportProps {
  onSubmit: (report: any) => void;
  isOffline?: boolean;
}

const symptoms = [
  { id: "diarrhea", label: "Diarrhea", icon: "💧" },
  { id: "fever", label: "Fever", icon: "🌡️" },
  { id: "vomiting", label: "Vomiting", icon: "🤢" },
  { id: "jaundice", label: "Jaundice", icon: "🟡" },
  { id: "dehydration", label: "Dehydration", icon: "🥵" },
  { id: "abdominal_pain", label: "Stomach Pain", icon: "😣" }
];

const villages = [
  "Dibrugarh Village",
  "Tinsukia Village",
  "Jorhat Village",
  "Golaghat Village",
  "Sivasagar Village",
  "Charaideo Village"
];

export function AshaReport({ onSubmit, isOffline = false }: AshaReportProps) {
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [caseCount, setCaseCount] = useState(1);
  const [notes, setNotes] = useState("");

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = () => {
    const report = {
      village: selectedVillage,
      symptoms: selectedSymptoms,
      caseCount,
      notes,
      timestamp: new Date().toISOString(),
      submittedBy: "ASHA Worker"
    };
    onSubmit(report);
  };

  const isFormValid = selectedVillage && selectedSymptoms.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex justify-center">
            <Image src="/bg/logo.png" alt="main logo" width={100} height={100} />
          </div>
          {isOffline && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CloudOff className="w-4 h-4" />
              <span>You are offline. Reports will be sent later.</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6 pb-24">
        {/* Village Selection */}
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="space-y-3">
            <Label className="text-base font-bold">Select your Village</Label>
            <Select value={selectedVillage} onValueChange={setSelectedVillage}>
              <SelectTrigger className="h-12 bg-input-background border-border text-base">
                <SelectValue placeholder="Choose your village" />
              </SelectTrigger>
              <SelectContent>
                {villages.map((village) => (
                  <SelectItem key={village} value={village} className="text-base">
                    {village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
        
        {/* Optional Notes */}
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="space-y-3">
            <Label className="text-base font-bold">What Symptoms are Reported?</Label>
            <Textarea
              placeholder="Symptoms oberved..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] bg-input-background border-border text-base resize-none"
            />
          </div>
        </Card>
        

        {/* Symptoms Selection */}
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="space-y-3">
            <Label className="text-base font-medium">Estimated Disease? (Optional) </Label>
            <div className="grid grid-cols-2 gap-3">
              {symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${selectedSymptoms.includes(symptom.id)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card-secondary"
                    }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-2xl">{symptom.icon}</div>
                    <div className="text-sm font-medium text-foreground">{symptom.label}</div>
                    {selectedSymptoms.includes(symptom.id) && (
                      <Check className="w-4 h-4 text-primary mx-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Case Count */}
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="space-y-3">
            <Label className="text-base font-bold">How many people are sick?</Label>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCaseCount(Math.max(1, caseCount - 1))}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-2xl font-semibold text-foreground min-w-[60px] text-center">
                {caseCount}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCaseCount(caseCount + 1)}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Optional Notes */}
        <Card className="p-4 shadow-card border-0 bg-card">
          <div className="space-y-3">
            <Label className="text-base font-medium">Any other details? (Optional)</Label>
            <Textarea
              placeholder="Additional information about the cases..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] bg-input-background border-border text-base resize-none"
            />
          </div>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full h-12 text-base font-medium"
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
}