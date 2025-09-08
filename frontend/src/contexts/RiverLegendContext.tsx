"use client"
import React, { useState, useContext, createContext, ReactNode } from "react";

// 1. Define the shape of your context
interface RiverLegendContextType {
  RiverLegend: string[]; // or whatever type your RiverLegend items are
  setRiverLegend: React.Dispatch<React.SetStateAction<string[]>>;
}

// 2. Create context with a default (null fallback)
const RiverLegendContext = createContext<RiverLegendContextType | null>(null);

// 3. Provider component
export function RiverLegendProvider({ children }: { children: ReactNode }) {
  const [RiverLegend, setRiverLegend] = useState<string[]>(["all"]);

  return (
    <RiverLegendContext.Provider value={{ RiverLegend, setRiverLegend }}>
      {children}
    </RiverLegendContext.Provider>
  );
}

// 4. Hook to use context safely
export function useRiverLegend() {
  const context = useContext(RiverLegendContext);
  if (!context) {
    throw new Error("useRiverLegend must be used within a RiverLegendProvider");
  }
  return context;
}
