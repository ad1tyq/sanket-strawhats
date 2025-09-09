// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sanket-strawhats.onrender.com/';

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

// Base pattern interface
export interface PatternDetected {
  type: string;
  severity: 'HIGH' | 'MODERATE' | 'LOW' | 'ELEVATED'; // Added ELEVATED from your backend
  actions: string[];
  report_count: number;
  timestamp: string;
}

// Specific pattern types
export interface DiseaseClusterPattern extends PatternDetected {
  type: 'disease_cluster';
  disease: string;
  total_cases: number;
  affected_locations: string[];
}

export interface LocationClusterPattern extends PatternDetected {
  type: 'location_cluster';
  location: string;
  total_cases: number;
  diseases_present: string[];
  high_risk_reports: number;
}

export interface HighRiskIndividualPattern extends PatternDetected {
  type: 'high_risk_individual';
  disease: string;
  location: string;
  cases: number;
  source_report: string;
}

export interface NoDataPattern extends PatternDetected {
  type: 'no_data';
  message: string;
}

// Union type for all possible patterns
export type Pattern = 
  | DiseaseClusterPattern 
  | LocationClusterPattern 
  | HighRiskIndividualPattern 
  | NoDataPattern;

export interface AnalysisResult {
  analysis_timestamp: string;
  total_reports: number;
  high_risk_patterns: number;
  moderate_risk_patterns: number;
  patterns_detected: Pattern[];
  recommended_actions: string[];
  priority_summary: {
    immediate_actions: string[];
    high_priority_actions: string[];
    standard_actions: string[];
  };
  error?: string; // Added error field for error cases
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

// Type guard functions for pattern discrimination
export function isDiseaseClusterPattern(pattern: Pattern): pattern is DiseaseClusterPattern {
  return pattern.type === 'disease_cluster';
}

export function isLocationClusterPattern(pattern: Pattern): pattern is LocationClusterPattern {
  return pattern.type === 'location_cluster';
}

export function isHighRiskIndividualPattern(pattern: Pattern): pattern is HighRiskIndividualPattern {
  return pattern.type === 'high_risk_individual';
}

export function isNoDataPattern(pattern: Pattern): pattern is NoDataPattern {
  return pattern.type === 'no_data';
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