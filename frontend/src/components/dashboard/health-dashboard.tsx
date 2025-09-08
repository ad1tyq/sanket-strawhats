"use client";
import { useState, useMemo } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { DataLayersSort } from "./DataLayers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { allAshaReports, AshaReport } from "../../../data/DiseaseData";
import Map from "./Map";

// Helper function to determine risk level based on case numbers
const getRisk = (cases: number): { level: 'High' | 'Medium' | 'Low', color: string } => {
  if (cases > 20) return { level: 'High', color: 'border-l-destructive' };
  if (cases > 10) return { level: 'Medium', color: 'border-l-warning' };
  return { level: 'Low', color: 'border-l-success' };
};

export function HealthDashboard() {
  const [diseaseFilter, setDiseaseFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  const filteredAndSortedOutbreaks = useMemo(() => {
    let outbreaks = [...allAshaReports];

    // 1. Filtering Logic
    if (diseaseFilter !== "all") {
      outbreaks = outbreaks.filter(report => report.estimatedDisease === diseaseFilter);
    }

    // 2. Sorting Logic
    if (sortBy === "recent") {
      outbreaks.sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime());
    } else if (sortBy === "cases") {
      outbreaks.sort((a, b) => b.cases - a.cases);
    }

    return outbreaks;
  }, [diseaseFilter, sortBy]);

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">S</span>
            </div>
            <div className="flex justify-center">
              <Image src="/bg/sanket-dashboard.png" alt="main logo" width={230} height={230} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Header content can go here */}
          </div>
        </div>
      </div>

      <div className="min-h-screen flex gap-5">
        {/* Left Panel: Data Layers */}
        <div className="bg-gray-300 mt-5 w-[15vw] h-[38rem] rounded-2xl p-10 mb-5 ml-5">
          <DataLayersSort />
        </div>

        {/* Center Panel: Map */}
        <div className="w-[55vw] mt-5 h-[38rem] rounded-2xl p-5 bg-gray-300 mb-5">
          <Map />
        </div>

        {/* Right Panel: Live Outbreak Feed */}
        <div className="w-[30vw] mr-5 border border-border bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Live Outbreak Feed</h3>
            <div className="flex items-center gap-2 mt-2">
              {/* Filter Control */}
              <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
                <SelectTrigger className="w-[60%]">
                  <SelectValue placeholder="Filter by disease" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Diseases</SelectItem>
                  <SelectItem value="cholera">Cholera</SelectItem>
                  <SelectItem value="typhoid">Typhoid</SelectItem>
                  <SelectItem value="diarrhea">Diarrhea</SelectItem>
                  <SelectItem value="jaundice">Jaundice</SelectItem>
                  <SelectItem value="dysentery">Dysentery</SelectItem>
                </SelectContent>
              </Select>
              {/* Sort Control */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[40%]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="cases">Highest Cases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex-1 p-4 space-y-3 overflow-auto">
            {filteredAndSortedOutbreaks.map((report: AshaReport) => {
              const risk = getRisk(report.cases);
              return (
                <Card key={report.id} className={`p-3 shadow-card border-l-4 ${risk.color}`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{report.village}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(report.reportedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {report.estimatedDisease} Outbreak
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{report.cases} cases</span>
                      <Badge variant="secondary" className={`${risk.level === 'High' ? 'bg-destructive text-destructive-foreground' : risk.level === 'Medium' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'}`}>
                        {risk.level} Risk
                      </Badge>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
