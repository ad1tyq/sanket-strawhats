'use client';

import { useState, useCallback } from 'react';
import { apiService, HealthReport, CommunityReport, AnalysisResult } from '@/lib/api';

type ApiResponse = Record<string, unknown>;

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  const callApi = useCallback(async <T,>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result as unknown as ApiResponse);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    submitReport: (report: HealthReport) =>
      callApi(() => apiService.submitReport(report)),
    submitCommunityReport: (report: CommunityReport) =>
      callApi(() => apiService.submitCommunityReport(report)),
    generateHealthActions: () =>
      callApi<AnalysisResult>(() => apiService.generateHealthActions()),
    getCommunityReports: () =>
      callApi(() => apiService.getCommunityReports()),
    getOutbreaks: () =>
      callApi(() => apiService.getOutbreaks()),
    loadSampleData: () =>
      callApi(() => apiService.loadSampleData()),
    getAllData: () =>
      callApi(() => apiService.getAllData()),
    reset: () => {
      setData(null);
      setError(null);
    },
  };
}
