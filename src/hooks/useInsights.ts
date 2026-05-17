import { useState, useEffect } from 'react';
import { getAnalysisResult } from '../services/analysisApi';
import type { Insight } from '../types/analysis';

interface UseInsightsResult {
  insights: Insight[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches the insights array from the analysis result for a given job.
 */
export function useInsights(jobId: string | undefined): UseInsightsResult {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick(n => n + 1);

  useEffect(() => {
    if (!jobId) { return; }

    setIsLoading(true);
    setError(null);

    getAnalysisResult(jobId)
      .then(result => {
        setInsights(result.insights ?? []);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load insights.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [jobId, tick]);

  return { insights, isLoading, error, refetch };
}
