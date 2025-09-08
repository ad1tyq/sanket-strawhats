import { RiverLocation, MonitoringPoint } from "../../../data/RiverDataUtils";
import { AshaReport } from "../../../data/DiseaseData";

// --- Type Definitions ---
// The component now accepts a union type of all possible points on the map
type MapPoint = RiverLocation | AshaReport;

// A helper function to check if the point is a AshaReport
// This is called a "type guard" and helps TypeScript understand our logic
function isAshaReport(point: MapPoint): point is AshaReport {
  return 'cases' in point;
}

// --- The Updated Component ---
const LocationDetails = ({ location }: { location: MapPoint | null }) => {
    // This is the view when no location is selected
    if (!location) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner h-full">
                <h3 className="font-semibold text-lg text-gray-800">Point Details</h3>
                <p className="text-gray-500 mt-2">Click on any marker on the map to see its details here.</p>
            </div>
        );
    }

    // --- Conditional Rendering based on the type of point selected ---

    // Case 1: The selected point is a Disease Outbreak
    if (isAshaReport(location)) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-lg h-full">
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    Disease Outbreak
                </span>
                <h3 className="font-semibold text-lg text-gray-900 mt-3 capitalize">{location.estimatedDisease}</h3>
                <p className="text-sm text-gray-500">{location.village}</p>
                
                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-gray-700">
                    <p><strong>Cases Reported:</strong> {location.cases}</p>
                    <p><strong>Date:</strong> {location.reportedDate}</p>
                    <p><strong>Coordinates:</strong> {location.latitude}, {location.longitude}</p>
                    <p><strong>Symptoms:</strong> {location.symptoms}</p>
                    <p><strong>Other Details:</strong> {location.otherDetails}</p>
                </div>
            </div>
        );
    }

    // Case 2: The selected point is a River Location (either monitoring or polluted)
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg h-full">
            {location.type === 'monitoring' ? (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    Clean Rivers
                </span>
            ) : (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    Polluted Rivers
                </span>
            )}

            <h3 className="font-semibold text-lg text-gray-900 mt-3">{location.riverName}</h3>
            <p className="text-sm text-gray-500">{location.locationDescription}</p>
            
            <div className="mt-4 pt-4 border-t space-y-2 text-sm text-gray-700">
                <p><strong>Coordinates:</strong> {location.latitude}, {location.longitude}</p>

                {location.type === 'monitoring' && (
                    <>
                        <p><strong>State:</strong> {(location as MonitoringPoint).state}</p>
                        <p><strong>District:</strong> {(location as MonitoringPoint).district}</p>
                        {(location as MonitoringPoint).notes && (
                            <p className="pt-2"><strong>Notes:</strong> {(location as MonitoringPoint).notes}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LocationDetails;

