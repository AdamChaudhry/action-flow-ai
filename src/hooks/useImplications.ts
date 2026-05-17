import { useState, useEffect } from 'react';
import { getAnalysisResult } from '../services/analysisApi';
import type { Implication } from '../types/analysis';

interface UseImplicationsResult {
  implications: Implication[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches the implications array from the analysis result for a given job.
 */
export function useImplications(jobId: string | undefined): UseImplicationsResult {
  const [implications, setImplications] = useState<Implication[]>([]);
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
        setImplications(result.implications ?? []);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load implications.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [jobId, tick]);

  return { implications, isLoading, error, refetch };
}
