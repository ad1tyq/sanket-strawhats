"use client"
import * as React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// --- Context Imports ---
import { useDiseaseLegend } from "@/contexts/DiseaseLegendContext";

// --- Component Imports ---
import Legends from "./Legend";
import LocationDetails from "./Details";

// --- Type Definitions ---
interface CommunityReport {
  id: number;
  reportedDate: string;
  latitude: number;
  longitude: number;
  village: string;
  symptoms: string;
  estimatedDisease: string;
  cases: number;
  otherDetails?: string;
  risk_level?: string;
  symptoms_text?: string;
  timestamp?: string;
}

interface MapProps {
  reports: CommunityReport[];
}

const center = [26.4826, 92.1321] as [number, number];

export default function LeafletMap({ reports }: MapProps) {
  const [selectedPoint, setSelectedPoint] = React.useState<CommunityReport | null>(null);
  
  const { DiseaseLegend: diseaseSelection } = useDiseaseLegend();

  const filteredPoints = React.useMemo(() => {
    if (diseaseSelection.length === 0 || diseaseSelection.includes("all-diseases")) {
      return reports;
    }
    return reports.filter(report => {
      const reportDisease = report.estimatedDisease?.toLowerCase();
      return diseaseSelection.some(selectedDisease => 
        selectedDisease.toLowerCase() === reportDisease
      );
    });
  }, [reports, diseaseSelection]);

  const getColorForReport = (report: CommunityReport) => {
    const d = report.estimatedDisease?.toLowerCase();
    if (d === 'cholera') return '#FF0000';
    if (d === 'typhoid') return '#E11D48';
    if (d === 'diarrhea') return '#BE123C';
    if (d === 'jaundice') return '#9F1239';
    if (d === 'dysentery') return '#881337';
    return '#6B7280'; // unknown or default
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        {/* z-0 ensures leaflet stays behind dropdowns/navs, while UI overlays get higher z-indexes */}
        <div style={{ height: "84vh", width: "100%" }} className="z-0 relative rounded-lg overflow-hidden shadow-lg">
          <MapContainer 
            center={center} 
            zoom={6} 
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredPoints.map((report) => (
              <CircleMarker
                key={`report-${report.id}`}
                center={[report.latitude, report.longitude]}
                radius={8}
                pathOptions={{
                  fillColor: getColorForReport(report),
                  color: "#FFFFFF",
                  weight: 1,
                  fillOpacity: 0.8
                }}
                eventHandlers={{
                  click: () => setSelectedPoint(report)
                }}
              >
                <Tooltip>
                  {report.village} - {report.cases} cases of {report.estimatedDisease}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        
        <div className="z-[1000] absolute bottom-4 right-4">
            <Legends />
        </div>
        
        {/* Map Info Overlay */}
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
          <div className="text-sm font-semibold">Outbreak Reports</div>
          <div className="text-xs text-gray-600">
            {filteredPoints.length} reports displayed
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/3">
        <LocationDetails location={selectedPoint} />
      </div>
    </div>
  );
}
