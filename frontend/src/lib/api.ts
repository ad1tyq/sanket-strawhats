// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface HealthReport {
  village: string;
  district: string;
  symptoms: string[];
  cases: number;
  water_status: string;
  reporter: string;
}

export interface CommunityReport {
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

// Define pattern interface for better type safety
export interface PatternDetected {
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  disease?: string;
  location?: string;
  total_cases?: number;
  description?: string;
}

export interface AnalysisResult {
  analysis_timestamp: string;
  total_reports: number;
  high_risk_patterns: number;
  moderate_risk_patterns: number;
  patterns_detected: PatternDetected[];
  recommended_actions: string[];
  priority_summary: {
    immediate_actions: string[];
    high_priority_actions: string[];
    standard_actions: string[];
  };
}

// Define outbreak interface
export interface Outbreak {
  id?: number;
  disease: string;
  location: string;
  cases: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  reported_date: string;
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
  description?: string;
  actions_taken?: string[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async fetchWithErrorHandling(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Health Reports
  async submitReport(report: HealthReport) {
    return this.fetchWithErrorHandling('/submit_report/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  async getReports() {
    return this.fetchWithErrorHandling('/get_reports/');
  }

  // Community Reports
  async submitCommunityReport(report: CommunityReport) {
    return this.fetchWithErrorHandling('/submit_community_report/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  async getCommunityReports() {
    return this.fetchWithErrorHandling('/get_community_reports/');
  }

  // Outbreaks
  async submitOutbreak(outbreak: Outbreak) {
    return this.fetchWithErrorHandling('/submit_outbreak/', {
      method: 'POST',
      body: JSON.stringify(outbreak),
    });
  }

  async getOutbreaks(): Promise<Outbreak[]> {
    return this.fetchWithErrorHandling('/get_outbreaks/');
  }

  // Analysis
  async generateHealthActions(): Promise<AnalysisResult> {
    return this.fetchWithErrorHandling('/generate_health_actions/');
  }

  // Load sample data
  async loadSampleData() {
    return this.fetchWithErrorHandling('/load_sample_community_data/', {
      method: 'POST',
    });
  }

  // Get all data
  async getAllData() {
    return this.fetchWithErrorHandling('/get_all_data/');
  }
}

export const apiService = new ApiService();