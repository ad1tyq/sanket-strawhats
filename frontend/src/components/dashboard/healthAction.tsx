// components/HealthDashboard.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/app/hooks/useAPI';
import { useReport } from '@/contexts/reportContext';
import { AnalysisResult, CommunityReport } from '@/lib/api';

export default function HealthAction() {
  const {  
    loading, 
    error, 
    submitCommunityReport,
    generateHealthActions, 
    getCommunityReports, 
  } = useApi();
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { Report } = useReport();

  useEffect(() => {
    getCommunityReports();
  }, [getCommunityReports]);

  const handleSubmitReport = useCallback(async (reportData: CommunityReport) => {
    try {
      await submitCommunityReport(reportData);
      console.log('Report submitted successfully');
      getCommunityReports();
    } catch (err) {
      console.error('Failed to submit report:', err);
    }
  }, [submitCommunityReport, getCommunityReports]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result : any= await generateHealthActions();
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (Report) {
      handleSubmitReport(Report);
    }
  }, [Report, handleSubmitReport]);

  if (loading) return <div className="p-4">Loading initial data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mt-10 mx-auto">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleAnalyze}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={loading || isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Generate Health Actions'}
        </button>
      </div>

      {/* Analysis Results Section */}
      {analysis && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Health Analysis Results</h2>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Total Reports</h3>
              <p className="text-3xl font-bold text-blue-600">{analysis.total_reports}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">High Risk Patterns</h3>
              <p className="text-3xl font-bold text-red-600">{analysis.high_risk_patterns}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Moderate Risk</h3>
              <p className="text-3xl font-bold text-yellow-600">{analysis.moderate_risk_patterns}</p>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Recommended Actions</h3>
            
            {/* Immediate Actions */}
            {analysis.priority_summary.immediate_actions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-red-700 mb-3">🚨 Immediate Actions</h4>
                <ul className="space-y-2">
                  {analysis.priority_summary.immediate_actions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-red-800">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* High Priority Actions */}
            {analysis.priority_summary.high_priority_actions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-orange-600 mb-3">⚠️ High Priority Actions</h4>
                <ul className="space-y-2">
                  {analysis.priority_summary.high_priority_actions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-orange-800">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Standard Actions */}
            {analysis.priority_summary.standard_actions.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-green-700 mb-3">📋 Standard Actions</h4>
                <ul className="space-y-2">
                  {analysis.priority_summary.standard_actions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-green-800">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pattern Analysis Details */}
          <div className="bg-white p-6 rounded-lg shadow border mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Pattern Analysis</h3>
            <div className="grid gap-4">
              {analysis.patterns_detected.map((pattern, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-700 capitalize">{pattern.type.replace('_', ' ')}</h4>
                  <p className="text-sm text-gray-600">
                    Severity: <span className={`font-semibold ${
                      pattern.severity === 'HIGH' ? 'text-red-600' :
                      pattern.severity === 'MEDIUM' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>{pattern.severity}</span>
                  </p>
                  {pattern.disease && <p className="text-sm">Disease: {pattern.disease}</p>}
                  {pattern.location && <p className="text-sm">Location: {pattern.location}</p>}
                  {pattern.total_cases && <p className="text-sm">Total Cases: {pattern.total_cases}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}