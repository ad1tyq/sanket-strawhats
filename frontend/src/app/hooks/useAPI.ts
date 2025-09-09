// hooks/useAPI.ts
'use client';

import { useState, useCallback } from 'react';
import { apiService, HealthReport, CommunityReport, AnalysisResult } from '@/lib/api';

// Define a type for the API response data
interface ApiResponse {
  reports?: any[];
  [key: string]: any;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  const callApi = useCallback(async (apiCall: () => Promise<ApiResponse>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReport = useCallback((report: HealthReport) => 
    callApi(() => apiService.submitReport(report)), [callApi]);

  const submitCommunityReport = useCallback((report: CommunityReport) => 
    callApi(() => apiService.submitCommunityReport(report)), [callApi]);

  const generateHealthActions = useCallback(() => 
    callApi(() => apiService.generateHealthActions() as Promise<ApiResponse>), [callApi]);

  const getCommunityReports = useCallback(() => 
    callApi(() => apiService.getCommunityReports()), [callApi]);

  const getOutbreaks = useCallback(() => 
    callApi(() => apiService.getOutbreaks()), [callApi]);

  const loadSampleData = useCallback(() => 
    callApi(() => apiService.loadSampleData()), [callApi]);

  const getAllData = useCallback(() => 
    callApi(() => apiService.getAllData()), [callApi]);

  return {
    loading,
    error,
    data,
    submitReport,
    submitCommunityReport,
    generateHealthActions,
    getCommunityReports,
    getOutbreaks,
    loadSampleData,
    getAllData,
    reset: () => {
      setData(null);
      setError(null);
    }
  };
}