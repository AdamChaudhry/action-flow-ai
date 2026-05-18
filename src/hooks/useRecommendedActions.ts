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
    let isActive = true;

    setActions([]);

    if (!jobId) {
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    getAnalysisResult(jobId)
      .then(result => {
        if (isActive) {
          setActions(result.recommendedActions ?? []);
        }
      })
      .catch(err => {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Failed to load actions.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [jobId, tick]);

  return { actions, isLoading, error, refetch };
}
