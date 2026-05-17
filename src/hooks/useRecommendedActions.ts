import { useState, useEffect } from 'react';
import { getAnalysisResult } from '../services/analysisApi';
import type { RecommendedAction } from '../types/analysis';

interface UseRecommendedActionsResult {
  actions: RecommendedAction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches the recommendedActions array from the analysis result for a given job.
 */
export function useRecommendedActions(
  jobId: string | undefined,
): UseRecommendedActionsResult {
  const [actions, setActions] = useState<RecommendedAction[]>([]);
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
        setActions(result.recommendedActions ?? []);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load actions.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [jobId, tick]);

  return { actions, isLoading, error, refetch };
}
