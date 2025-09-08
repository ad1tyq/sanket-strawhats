"use client";
import React, { useState, useContext, createContext, ReactNode, Dispatch, SetStateAction } from "react";

interface ReportContextType {
    Report: any;
    setReport: Dispatch<SetStateAction<any>>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
    children: ReactNode;
}

export function ReportProvider({ children }: ReportProviderProps) {
    const [Report, setReport] = useState<any>(null);
    
    return (
        <ReportContext.Provider value={{ Report, setReport }}>
            {children}
        </ReportContext.Provider>
    );
}

export function useReport() {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error("useReport must be used within an ReportProvider");
    }
    return context;
}