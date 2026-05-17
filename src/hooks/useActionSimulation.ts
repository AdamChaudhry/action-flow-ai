import { useState, useEffect } from 'react';
import { getSimulationRecord } from '../services/analysisApi';
import type { ActionSimulation } from '../types/analysis';

interface UseActionSimulationResult {
  simulation: ActionSimulation | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches a specific simulation via GET /api/analysis-jobs/:jobId/simulations/:simulationId.
 * No polling needed — the record is created synchronously by the simulate endpoint.
 */
export function useActionSimulation(
  jobId: string | undefined,
  simulationId: string | undefined,
): UseActionSimulationResult {
  const [simulation, setSimulation] = useState<ActionSimulation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !simulationId) { return; }

    setIsLoading(true);
    setError(null);
    setSimulation(null);

    getSimulationRecord(jobId, simulationId)
      .then(record => {
        setSimulation(record.simulation);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load simulation.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [jobId, simulationId]);

  return { simulation, isLoading, error };
}
