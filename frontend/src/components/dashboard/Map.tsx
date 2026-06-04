"use client"
import dynamic from 'next/dynamic';
import * as React from "react";

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

// Dynamically import the leaflet map to avoid "window is not defined" SSR errors
const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[84vh] bg-gray-200 shadow-lg flex items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="font-semibold text-lg text-gray-500">Loading Map...</h1>
      </div>
    </div>
  )
});

export default function Map(props: MapProps) {
  return <DynamicMap {...props} />;
}