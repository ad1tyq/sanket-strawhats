import { RiverLocation, MonitoringPoint } from "../../../data/RiverDataUtils";

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

// A helper function to check if the point is a RiverLocation
function isRiverLocation(point: CommunityReport | RiverLocation | null): point is RiverLocation {
  return point !== null && 'riverName' in point;
}

// --- The Updated Component ---
const LocationDetails = ({ location }: { location: CommunityReport | RiverLocation | null }) => {
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

    // Case 1: The selected point is a River Location (either monitoring or polluted)
    if (isRiverLocation(location)) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-lg h-full">
                {location.type === 'monitoring' ? (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                        Clean River
                    </span>
                ) : (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                        Polluted River
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
    }

    // Case 2: The selected point is a Disease Outbreak (CommunityReport)
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg h-full">
            <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 mb-2 rounded-full">
                Disease Outbreak
            </span>
            
            {/* Risk Level Badge */}
            {location.risk_level && (
                <span className={`inline-block text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full ${
                    location.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                    location.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {location.risk_level} Risk
                </span>
            )}

            <h3 className="font-semibold text-lg text-gray-900 mt-3 capitalize">{location.estimatedDisease || 'Unknown Disease'}</h3>
            <p className="text-sm text-gray-500">{location.village}</p>
            
            <div className="mt-4 pt-4 border-t space-y-2 text-sm text-gray-700">
                <p><strong>Cases Reported:</strong> {location.cases}</p>
                <p><strong>Date:</strong> {new Date(location.reportedDate || location.timestamp || '').toLocaleDateString()}</p>
                <p><strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                
                {/* Use symptoms_text if available, otherwise fall back to symptoms */}
                <p><strong>Symptoms:</strong> {location.symptoms_text || location.symptoms || 'No symptoms reported'}</p>
                
                {location.otherDetails && (
                    <p><strong>Additional Details:</strong> {location.otherDetails}</p>
                )}
            </div>
        </div>
    );
};

export default LocationDetails;