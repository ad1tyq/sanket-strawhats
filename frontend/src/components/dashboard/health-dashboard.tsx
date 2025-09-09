"use client";
import { useState, useMemo, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { DataLayersSort } from "./DataLayers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Map from "./Map";
import { useSession, signIn } from "next-auth/react"
import SignOut from "../SignOut";
import HealthAction from "./healthAction";
import { Button } from "../ui/button";
import { useApi } from '@/app/hooks/useAPI';

// Helper function to determine risk level based on case numbers
const getRisk = (cases: number): { level: 'High' | 'Medium' | 'Low', color: string } => {
  if (cases > 20) return { level: 'High', color: 'border-l-destructive' };
  if (cases > 10) return { level: 'Medium', color: 'border-l-yellow-400' };
  return { level: 'Low', color: 'border-l-green-400' };
};

type View = "home" | "asha-login" | "asha-report" | "asha-success" | "dashboard" | "call";

export function HealthDashboard() {
  const [diseaseFilter, setDiseaseFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const {  
    data,
    loading, 
    error, 
    getCommunityReports,
  } = useApi();

  // Load community reports on component mount
  useEffect(() => {
    getCommunityReports();
  }, [getCommunityReports]);

  // Extract reports from API response
  const communityReports = data?.reports || [];

  const filteredAndSortedOutbreaks = useMemo(() => {
    let outbreaks = [...communityReports];

    // 1. Filtering Logic
    if (diseaseFilter !== "all") {
      outbreaks = outbreaks.filter(report => 
        report.estimatedDisease?.toLowerCase() === diseaseFilter.toLowerCase()
      );
    }

    // 2. Sorting Logic
    if (sortBy === "recent") {
      outbreaks.sort((a, b) => {
        const dateA = new Date(a.reportedDate || a.timestamp).getTime();
        const dateB = new Date(b.reportedDate || b.timestamp).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === "cases") {
      outbreaks.sort((a, b) => b.cases - a.cases);
    }

    return outbreaks;
  }, [diseaseFilter, sortBy, communityReports]);

  if (!session) {
    return (
      <>
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center">
                <Image src="/bg/sanket-dashboard.png" alt="main logo" width={230} height={230} />
              </div>
              <div className="w-21 h-8 text-sm rounded-lg flex items-center justify-center">
                <button className="bg-white border border-gray-400 text-black transition-all duration-200 hover:bg-gray-200 p-[0.2rem] px-[1rem] rounded-md cursor-pointer"
                  onClick={() => signIn()}>Sign In</button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-20 flex size-full min-h-screen flex-col overflow-x-hidden text-[var(--text-primary)]">
          <div className="flex flex-col items-center">
            <div className="shadow-lg bg-gray-200 mt-10 rounded-[10px] w-[auto] text-[clamp(0.9rem,1.1vw,1.1rem)] h-auto py-10 px-8 gap-5 flex flex-col justify-center">
              <p><b>Session Logged Out: Log In to Continue</b></p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading data: {error}</p>
          <Button onClick={getCommunityReports} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex justify-center">
              <Image src="/bg/sanket-dashboard.png" alt="main logo" width={230} height={230} />
            </div>
            <div className="w-21 h-8 rounded-lg flex items-center justify-center">
              <div className="flex justify-center gap-5 items-center">
                <SignOut />
              </div>
            </div>
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
          <Map reports={communityReports} />

          <div className="absolute mt-149 top-4 left-209 z-10">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(true)}
              className="hover:text-white text-white duration-300 transition-all hover:bg-green-500 bg-green-400 cursor-pointer"
            >
              Call To Action
            </Button>
          </div>
          {isOpen && (
            <HealthAction />
          )}
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
            {filteredAndSortedOutbreaks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {communityReports.length === 0 ? 
                  "No outbreak reports yet. Submit a report to see data here." : 
                  "No reports match your filter criteria."
                }
              </div>
            ) : (
              filteredAndSortedOutbreaks.map((report) => {
                const risk = getRisk(report.cases);
                const reportDate = report.reportedDate || report.timestamp;
                
                return (
                  <Card key={report.id} className={`p-3 shadow-card border-l-4 ${risk.color}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{report.village}</div>
                        <div className="text-xs text-muted-foreground">
                          {reportDate ? new Date(reportDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short' 
                          }) : 'Date unknown'}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {report.estimatedDisease || 'Unknown'} Outbreak
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{report.cases} cases</span>
                        <Badge variant="secondary" className={`${
                          risk.level === 'High' ? 'bg-red-400 text-destructive-foreground' : 
                          risk.level === 'Medium' ? 'bg-yellow-200 text-warning-foreground' : 
                          'bg-green-200 text-success-foreground'
                        }`}>
                          {report.risk_level || risk.level} Risk
                        </Badge>
                      </div>
                      {report.symptoms_text && (
                        <div className="text-xs text-gray-500 truncate">
                          {report.symptoms_text}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Refresh Button */}
          <div className="p-4 border-t">
            <Button 
              onClick={getCommunityReports} 
              variant="outline" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Reports"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}