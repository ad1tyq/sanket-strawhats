// Legend.tsx
"use client"
import Image from "next/image";
import { useRiverLegend } from "@/contexts/RiverLegendContext";
import { useDiseaseLegend } from "@/contexts/DiseaseLegendContext";

export default function Legends() {
  // Consume contexts to know what is currently selected
  const { RiverLegend: riverSelection } = useRiverLegend();
  const { DiseaseLegend: diseaseSelection } = useDiseaseLegend();

  const showDiseases = diseaseSelection.length > 0;
  const showPolluted = riverSelection.includes("polluted");
  const showMonitoring = riverSelection.includes("monitoring"); // Assuming "clean" is "monitoring"

  // If nothing is selected, don't show the legend
  if (!showDiseases && !showPolluted && !showMonitoring) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
      <h3 className="font-semibold mb-2 text-sm">Legend</h3>
      <div className="flex flex-col gap-2">
        
        {/* Conditionally render each legend item */}
        {showDiseases && (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor:"#FF0000", opacity: "70%" }}></div>
                <span className="text-xs">Disease Outbreak</span>
            </div>
        )}

        {showPolluted && (
            <div className="flex items-center gap-2">
                <Image src="/assets/water-pollution.png" width={16} height={16} alt="polluted river"/>
                <span className="text-xs">Polluted Hotspot</span>
            </div>
        )}

        {showMonitoring && (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs">Monitoring Station</span>
            </div>
        )}
        
      </div>
    </div>
  );
}
