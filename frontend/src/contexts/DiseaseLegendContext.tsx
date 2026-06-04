"use client"
import React, { useState, useContext, createContext, ReactNode } from "react";

interface DiseaseLegendContextType {
  DiseaseLegend: string[];
  setDiseaseLegend: React.Dispatch<React.SetStateAction<string[]>>;
}

const DiseaseLegendContext = createContext<DiseaseLegendContextType | null>(null);

export function DiseaseLegendProvider({ children }: { children: ReactNode }) {
  // ✅ Default state is now 'all-diseases' to show everything initially
  const [DiseaseLegend, setDiseaseLegend] = useState<string[]>(["all-diseases"]);

  return (
    <DiseaseLegendContext.Provider value={{ DiseaseLegend, setDiseaseLegend }}>
      {children}
    </DiseaseLegendContext.Provider>
  );
}

export function useDiseaseLegend() {
  const context = useContext(DiseaseLegendContext);
  if (!context) {
    throw new Error("useDiseaseLegend must be used within a DiseaseLegendProvider");
  }
  return context;
}

