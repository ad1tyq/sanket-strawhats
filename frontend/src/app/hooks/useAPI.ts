'use client';

import { useState, useCallback } from 'react';
import { apiService, CommunityReport, AnalysisResult } from '@/lib/api';

type ApiResponse = Record<string, unknown>;

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  // Generic API caller
  const callApi = useCallback(async <T,>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result as unknown as ApiResponse);
      return result;
    } catch (err: unknown) {
      const error = err as Error;
      setError(error?.message || 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Community reports API - now uses callApi to avoid duplication
  const getCommunityReports = useCallback(() => {
    return callApi(() => apiService.getCommunityReports());
  }, [callApi]);

  return {
    loading,
    error,
    data,
    getCommunityReports,
    submitCommunityReport: (report: CommunityReport) =>
      callApi(() => apiService.submitCommunityReport(report)),
    generateHealthActions: () =>
      callApi<AnalysisResult>(() => apiService.generateHealthActions()),
    getAllData: () =>
      callApi(() => apiService.getAllData()),
    reset: () => {
      setData(null);
      setError(null);
    },
  };
}
