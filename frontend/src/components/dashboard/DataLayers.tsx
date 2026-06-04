"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRiverLegend } from "@/contexts/RiverLegendContext" // You would use your context here
import { useDiseaseLegend } from "@/contexts/DiseaseLegendContext"

// --- Data Definitions ---
const diseaseItems = [
  { id: "all-diseases", label: "All Diseases" },
  { id: "cholera", label: "Cholera" },
  { id: "typhoid", label: "Typhoid" },
  { id: "diarrhea", label: "Diarrhea" },
  { id: "jaundice", label: "Jaundice" },
  { id: "dysentery", label: "Dysentery" },
] as const;

const riverItems = [
  { id: "clean", label: "Clean Rivers" },
  { id: "polluted", label: "Polluted Rivers" },
] as const;

// --- Main Component ---
export function DataLayersSort() {
  // In your real app, these states would come from your context
  const { setRiverLegend } = useRiverLegend(); const { setDiseaseLegend } = useDiseaseLegend();
  const [diseaseSelection, setDiseaseSelection] = React.useState<string[]>(["all-diseases"]);
  const [riverSelection, setRiverSelection] = React.useState<string[]>([]); // Default is off

  // --- Handler for the Disease Checkboxes ---
  const handleDiseaseChange = (checked: boolean, itemId: string) => {
    let newSelection: string[];

    if (itemId === "all-diseases") {
      // If "All Diseases" is checked, it's the only item. If unchecked, the list is empty.
      newSelection = checked ? ["all-diseases"] : [];
    } else {
      // It's a specific disease
      if (checked) {
        // Add the new disease and remove "all-diseases" if it exists
        newSelection = [...diseaseSelection.filter(v => v !== "all-diseases"), itemId];
      } else {
        // Remove the specific disease
        newSelection = diseaseSelection.filter(v => v !== itemId);
      }
    }
    setDiseaseSelection(newSelection);
    setDiseaseLegend(newSelection); // Update your context
  };

  // --- Handler for the River Checkboxes ---
  const handleRiverChange = (checked: boolean, itemId: string) => {
    let newSelection: string[];
    if (checked) {
      newSelection = [...riverSelection, itemId];
    } else {
      newSelection = riverSelection.filter(v => v !== itemId);
    }
    setRiverSelection(newSelection);
    setRiverLegend(newSelection); // Update your context
  };

  return (
    <div className="w-[110%]">
      {/* --- Section 1: Disease Data Layers --- */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Disease Data Layers</h3>
          <p className="text-sm text-muted-foreground">Select outbreaks to display on the map.</p>
        </div>
        {diseaseItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={diseaseSelection.includes(item.id)}
              onCheckedChange={(checked) => handleDiseaseChange(!!checked, item.id)}
            />
            <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
              {item.label}
            </Label>
          </div>
        ))}
      </div>

      {/* --- Section 2: River Data Layers --- */}
      <div className="space-y-3 pt-6">
        <div>
          <h3 className="text-base font-semibold">River Data Layers</h3>
          <p className="text-sm text-muted-foreground">Toggle visibility of river monitoring data.</p>
        </div>
        {riverItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={riverSelection.includes(item.id)}
              onCheckedChange={(checked) => handleRiverChange(!!checked, item.id)}
            />
            <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
              {item.label}
            </Label>
          </div>
        ))}
      </div>

      {/* --- Debug Section --- */}
      <div className="space-y-2 text-xs bg-white rounded-xl p-3 text-gray-700 mt-6 border">
        <p><b>Disease Selection:</b> {JSON.stringify(diseaseSelection)}</p>
        <p><b>River Selection:</b> {JSON.stringify(riverSelection)}</p>
      </div>
    </div>
  );
}
