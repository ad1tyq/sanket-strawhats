"use client"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import * as React from "react";

// --- Context Imports ---
import { useRiverLegend } from "@/contexts/RiverLegendContext";
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

// --- Map Constants ---
const containerStyle = {
  width: "100%",
  height: "84vh",
};
const center = {
  lat: 26.4826,
  lng: 92.1321,
};

export default function Map({ reports }: MapProps) {
  const [selectedPoint, setSelectedPoint] = React.useState<CommunityReport | null>(null);
  
  const { RiverLegend: riverSelection } = useRiverLegend();
  const { DiseaseLegend: diseaseSelection } = useDiseaseLegend();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ['visualization'],
  });

  const icons = React.useMemo(() => {
    if (!isLoaded) return {};
    const diseaseMarkerBase = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 0.8,
      strokeWeight: 1,
      strokeColor: "#FFFFFF",
      scale: 8,
    };
    return {
      cholera: { ...diseaseMarkerBase, fillColor: "#FF0000" },
      typhoid: { ...diseaseMarkerBase, fillColor: "#E11D48" },
      diarrhea: { ...diseaseMarkerBase, fillColor: "#BE123C" },
      jaundice: { ...diseaseMarkerBase, fillColor: "#9F1239" },
      dysentery: { ...diseaseMarkerBase, fillColor: "#881337" },
      unknown: { ...diseaseMarkerBase, fillColor: "#6B7280" } 
    };
  }, [isLoaded]);

  const filteredPoints = React.useMemo(() => {
    // If no disease filter is selected, show all reports
    if (diseaseSelection.length === 0 || diseaseSelection.includes("all-diseases")) {
      return reports;
    }

    // Filter reports based on selected diseases
    return reports.filter(report => {
      const reportDisease = report.estimatedDisease?.toLowerCase();
      return diseaseSelection.some(selectedDisease => 
        selectedDisease.toLowerCase() === reportDisease
      );
    });
  }, [reports, diseaseSelection]);

  const getIconForReport = (report: CommunityReport) => {
    if (report.estimatedDisease && report.estimatedDisease.toLowerCase() in icons) {
      return icons[report.estimatedDisease.toLowerCase() as keyof typeof icons];
    }
    return icons.unknown;
  }

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return '#EF4444'; // red
      case 'medium': return '#F59E0B'; // yellow
      case 'low': return '#10B981'; // green
      default: return '#6B7280'; // gray
    }
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[84vh] bg-gray-200 shadow-lg flex items-center justify-center rounded-lg">
        <h1 className="font-semibold text-lg text-gray-500">Loading Map...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={6}
          options={{ 
            mapId: "HEALTH_MONITORING_MAP", 
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true
          }}
        >
          {filteredPoints.map((report) => (
            <Marker
              key={`report-${report.id}`}
              position={{ lat: report.latitude, lng: report.longitude }}
              icon={getIconForReport(report)}
              onClick={() => setSelectedPoint(report)}
              title={`${report.village} - ${report.cases} cases of ${report.estimatedDisease}`}
            />
          ))}
        </GoogleMap>
        <Legends />
        
        {/* Map Info Overlay */}
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
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