import { useState, useCallback } from 'react';
import { simulateAnalysisAction } from '../services/analysisApi';

interface UseSubmitSimulationResult {
  isSubmitting: boolean;
  error: string | null;
  /** Returns the simulationId on success, null on failure. */
  triggerSimulation: (jobId: string, actionId: string) => Promise<string | null>;
}

/**
 * Calls POST /api/analysis-jobs/:jobId/actions/:actionId/simulate.
 * Returns the Firestore simulationId on success so the caller can navigate
 * directly to GET /simulations/:simulationId.
 */
export function useSubmitSimulation(): UseSubmitSimulationResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerSimulation = useCallback(
    async (jobId: string, actionId: string): Promise<string | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const record = await simulateAnalysisAction(jobId, actionId);
        return record.id;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to start simulation.',
        );
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { isSubmitting, error, triggerSimulation };
}
