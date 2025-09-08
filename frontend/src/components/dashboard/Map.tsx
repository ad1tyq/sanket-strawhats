"use client"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import * as React from "react";

// --- Data Imports ---
import { allRiverLocations, RiverLocation } from "../../../data/RiverDataUtils";
import { allAshaReports, AshaReport } from "../../../data/DiseaseData"; // Corrected path to lowercase

// --- Context Imports ---
import { useRiverLegend } from "@/contexts/RiverLegendContext";
import { useDiseaseLegend } from "@/contexts/DiseaseLegendContext";

// --- Component Imports ---
import Legends from "./Legend";
import LocationDetails from "./Details";

// --- Type Definitions ---
type MapPoint = RiverLocation | AshaReport;

// --- Map Constants ---
const containerStyle = {
    width: "100%",
    height: "84vh",
};
const center = {
    lat: 26.4826,
    lng: 92.1321,
};

function isAshaReport(point: MapPoint): point is AshaReport {
    return 'village' in point;
}

export default function Map() {
    const [selectedPoint, setSelectedPoint] = React.useState<MapPoint | null>(null);
    
    const { RiverLegend: riverSelection } = useRiverLegend();
    const { DiseaseLegend: diseaseSelection } = useDiseaseLegend();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
        libraries: ['visualization'],
    });

    const icons = React.useMemo(() => {
        if (!isLoaded) return {};
        const size = new window.google.maps.Size(25, 25);
        const diseaseMarkerBase = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: "#FFFFFF",
            scale: 8,
        };
        return {
            monitoring: { url: "/assets/river.png", scaledSize: size },
            polluted: { url: "/assets/water-pollution.png", scaledSize: size },
            cholera: { ...diseaseMarkerBase, fillColor: "#FF0000" },
            typhoid: { ...diseaseMarkerBase, fillColor: "#E11D48" },
            diarrhea: { ...diseaseMarkerBase, fillColor: "#BE123C" },
            jaundice: { ...diseaseMarkerBase, fillColor: "#9F1239" },
            dysentery: { ...diseaseMarkerBase, fillColor: "#881337" },
            report: { ...diseaseMarkerBase, fillColor: "#6B7280" } 
        };
    }, [isLoaded]);


    const filteredPoints = React.useMemo(() => {
        const points: MapPoint[] = [];

        // Filter Rivers
        const showCleanRivers = riverSelection.includes("clean");
        const showPolluted = riverSelection.includes("polluted");

        if (showCleanRivers || showPolluted) {
            allRiverLocations.forEach(river => {
                if (showCleanRivers && river.type === 'monitoring') points.push(river);
                if (showPolluted && river.type === 'polluted') points.push(river);
            });
        }

        // Filter Diseases
        // ✅ FIX: Added a check to make sure `allAshaReports` is loaded before using it.
        if (diseaseSelection.length > 0 && allAshaReports) {
            if (diseaseSelection.includes("all-diseases")) {
                points.push(...allAshaReports);
            } else {
                const selectedDiseaseData = allAshaReports.filter(report => 
                    report.estimatedDisease && diseaseSelection.includes(report.estimatedDisease)
                );
                points.push(...selectedDiseaseData);
            }
        }
        
        return points;
    }, [riverSelection, diseaseSelection]);


    if (!isLoaded) {
        return (
            <div className="w-full h-[84vh] bg-gray-200 shadow-lg flex items-center justify-center rounded-lg">
                <h1 className="font-semibold text-lg text-gray-500">Loading Map...</h1>
            </div>
        );
    }
    
    const getIconForPoint = (point: MapPoint) => {
        if (isAshaReport(point)) {
            if (point.estimatedDisease && point.estimatedDisease in icons) {
                return icons[point.estimatedDisease as keyof typeof icons];
            }
            return icons.report;
        } else {
            return icons[point.type as keyof typeof icons];
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={6}
                    options={{ mapId: "YOUR_CUSTOM_MAP_ID", disableDefaultUI: true }}
                >
                    {filteredPoints.map((point) => (
                        <Marker
                            key={isAshaReport(point) ? `report-${point.id}` : `${point.type}-${point.id}`}
                            position={{ lat: point.latitude, lng: point.longitude }}
                            icon={getIconForPoint(point)}
                            onClick={() => setSelectedPoint(point)}
                        />
                    ))}
                </GoogleMap>
                <Legends />
            </div>
            <div className="w-full md:w-1/3">
                <LocationDetails location={selectedPoint} />
            </div>
        </div>
    );
}

