"use client"
import { useState } from "react";
import { AshaLogin } from "./asha-login";
import { AshaReport } from "./asha-report";
import { AshaSuccess } from "./asha-success";
import { HealthDashboard } from "../dashboard/health-dashboard";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Image from "next/image";
import { Monitor, Smartphone } from "lucide-react";

type View = "home" | "asha-login" | "asha-report" | "asha-success" | "dashboard";

export default function ASHA() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [lastReport, setLastReport] = useState<any>(null);
  const [isOffline] = useState(Math.random() > 0.7); // Simulate offline state

  const handleAshaLogin = () => {
    setCurrentView("asha-report");
  };

  const handleReportSubmit = (report: any) => {
    setLastReport(report);
    setCurrentView("asha-success");
  };

  const handleNewReport = () => {
    setCurrentView("asha-report");
  };

  // Home screen - choose interface
  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl font-semibold text-primary-foreground">
                <Image src="/bg/medical-symbol.png" alt="main logo" width={150} height={150} />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <Image src="/bg/logo.png" alt="main logo" width={150} height={150} />
              </div>
              <p className="text-muted-foreground">Smart Community Health Monitoring</p>
            </div>
          </div>

          {/* Interface Selection */}
          <div className="space-y-4">
            <Card className="p-6 shadow-card border-0 bg-card">
              <button
                onClick={() => setCurrentView("asha-login")}
                className="w-full text-left space-y-3 hover:bg-card-secondary cursor-pointer hover:bg-gray-100
                transition-all duration-300 rounded-lg p-2 -m-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">ASHA Reporter</h3>
                    <p className="text-sm text-muted-foreground">Submit health reports from the field</p>
                  </div>
                </div>
              </button>
            </Card>

            <Card className="p-6 shadow-card border-0 bg-card">
              <button
                onClick={() => setCurrentView("dashboard")}
                className="w-full text-left space-y-3 hover:bg-card-secondary cursor-pointer hover:bg-gray-100
                transition-all duration-300 rounded-lg p-2 -m-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Health Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Monitor district health status</p>
                  </div>
                </div>
              </button>
            </Card>
          </div>

          {/* Features */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Early warning system for water-borne diseases in rural Northeast India
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>• Offline Support</span>
              <span>• Real-time Monitoring</span>
              <span>• SMS Alerts</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ASHA Login
  if (currentView === "asha-login") {
    return (
      <div>
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("home")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Button>
        </div>
        <AshaLogin onLogin={handleAshaLogin} />
      </div>
    );
  }

  // ASHA Report Form
  if (currentView === "asha-report") {
    return (
      <div>
        <div className="absolute mt-18 top-4 right-4 z-10">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("home")}
            className="text-red-500 hover:text-red-500 duration-300 transition-all hover:bg-red-300
             bg-red-200 cursor-pointer"
          >
            Exit
          </Button>
        </div>
        <AshaReport onSubmit={handleReportSubmit} isOffline={isOffline} />
      </div>
    );
  }

  // ASHA Success
  if (currentView === "asha-success") {
    return (
      <AshaSuccess
        village={lastReport?.village || "Unknown Village"}
        isOffline={isOffline}
        onNewReport={handleNewReport}
      />
    );
  }

  // Health Dashboard
  if (currentView === "dashboard") {
    return (
      <div>
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("home")}
            className="text-red-500 hover:text-red-500 duration-300 transition-all hover:bg-red-300
             bg-red-200 cursor-pointer"
          >
            Exit
          </Button>
        </div>
        <HealthDashboard />
      </div>
    );
  }

  return null;
}