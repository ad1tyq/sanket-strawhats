/**
 * @file This file defines the unified data structure for all river locations,
 * combining both general monitoring points and specific polluted points.
 * It exports the TypeScript types and a single array `allRiverLocations`
 * containing all the transformed and combined data.
 */

// 1. The Base Interface with common properties for all locations.

import { MonitoringLocation, monitoringLocations } from "./cleanRiverData";
import { PollutedRiverLocation, pollutedRiverLocations } from "./pollutedRiverData";
export interface BaseRiverLocation {
  id: number;
  type: 'monitoring' | 'polluted'; // The discriminator to tell the types apart
  riverName: string;
  locationDescription: string;
  latitude: number;
  longitude: number;
}

// 2. The specific interface for a standard monitoring location.
export interface MonitoringPoint extends BaseRiverLocation {
  type: 'monitoring';
  district: string | null;
  state: string | null;
  notes: string | null;
}

// 3. The specific interface for a known polluted location.
export interface PollutedPoint extends BaseRiverLocation {
  type: 'polluted';
  // This type has no extra properties beyond the base, but is defined for clarity and future extension.
}

// 4. A Union Type that represents any possible river location.
export type RiverLocation = MonitoringPoint | PollutedPoint;




// --- Data Transformation and Combination ---

// Filter and transform the monitoring locations into the new structure.
const transformedMonitoringPoints: MonitoringPoint[] = monitoringLocations
  .filter(loc => loc.latitude != null && loc.longitude != null) // Ensure we have coordinates
  .map(loc => ({
    id: loc.id,
    type: 'monitoring',
    riverName: loc.monitoringLocation || 'Unknown Location', // Use monitoringLocation as the primary name
    locationDescription: loc.monitoringLocation || 'No description',
    latitude: loc.latitude!, // Assert non-null because we filtered
    longitude: loc.longitude!, // Assert non-null because we filtered
    district: loc.district,
    state: loc.state,
    notes: loc.notes,
  }));

// Filter and transform the polluted river locations.
const transformedPollutedPoints: PollutedPoint[] = pollutedRiverLocations
  .filter(loc => loc.latitude != null && loc.longitude != null) // Ensure we have coordinates
  .map(loc => ({
    // Offset the ID to prevent collisions with the monitoring locations
    id: loc.id + monitoringLocations.length,
    type: 'polluted',
    riverName: loc["river/stream"] || 'Unknown River',
    locationDescription: loc.location || 'No description',
    latitude: loc.latitude!,
    longitude: loc.longitude!,
  }));


// 5. The final combined and exported array of all river locations.
export const allRiverLocations: RiverLocation[] = [
  ...transformedMonitoringPoints,
  ...transformedPollutedPoints,
];
