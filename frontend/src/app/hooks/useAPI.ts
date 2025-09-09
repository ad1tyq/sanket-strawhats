// hooks/useAPI.ts
'use client';

import { useState, useCallback } from 'react';
import { apiService, HealthReport, CommunityReport, AnalysisResult } from '@/lib/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Make callApi generic
  const callApi = useCallback(async <T,>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReport = useCallback(
    (report: HealthReport) => callApi(() => apiService.submitReport(report)),
    [callApi]
  );

  const submitCommunityReport = useCallback(
    (report: CommunityReport) => callApi(() => apiService.submitCommunityReport(report)),
    [callApi]
  );

  const generateHealthActions = useCallback(
    () => callApi<AnalysisResult>(() => apiService.generateHealthActions()),
    [callApi]
  );

  const getCommunityReports = useCallback(
    () => callApi(() => apiService.getCommunityReports()),
    [callApi]
  );

  const getOutbreaks = useCallback(
    () => callApi(() => apiService.getOutbreaks()),
    [callApi]
  );

  const loadSampleData = useCallback(
    () => callApi(() => apiService.loadSampleData()),
    [callApi]
  );

  const getAllData = useCallback(
    () => callApi(() => apiService.getAllData()),
    [callApi]
  );

  return {
    loading,
    error,
    submitReport,
    submitCommunityReport,
    generateHealthActions,
    getCommunityReports,
    getOutbreaks,
    loadSampleData,
    getAllData,
    reset: () => setError(null),
  };
}
