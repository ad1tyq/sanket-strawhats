"use client";
import React, { useState, useContext, createContext, ReactNode, Dispatch, SetStateAction } from "react";

interface AshaReport {
    id: number;
    reportedDate: string;
    latitude: number;
    longitude: number;
    village: string;
    symptoms: string;
    estimatedDisease?: 'cholera' | 'typhoid' | 'diarrhea' | 'jaundice' | 'dysentery';
    cases: number;
    otherDetails?: string;
}

interface ReportContextType {
    Report: AshaReport | null;
    setReport: Dispatch<SetStateAction<AshaReport | null>>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
    children: ReactNode;
}

export function ReportProvider({ children }: ReportProviderProps) {
    // ✅ 3. Use the AshaReport type for the useState hook.
    const [Report, setReport] = useState<AshaReport | null>(null);
    
    return (
        <ReportContext.Provider value={{ Report, setReport }}>
            {children}
        </ReportContext.Provider>
    );
}

export function useReport() {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error("useReport must be used within a ReportProvider");
    }
    return context;
}
