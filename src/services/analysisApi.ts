import { API_BASE_URL, PLACEHOLDER_USER_ID } from '../constants/config';
import type {
  AnalysisJob,
  AnalysisResult,
  SimulationRecord,
  SubmitJobPayload,
  SubmitJobResponse,
} from '../types/analysis';

function authHeaders(): Record<string, string> {
  return { 'x-user-id': PLACEHOLDER_USER_ID };
}

async function parseError(response: Response): Promise<Error> {
  try {
    const body = await response.json();
    return new Error(
      body?.error?.message ?? body?.message ?? `HTTP ${response.status}`,
    );
  } catch {
    return new Error(`HTTP ${response.status}`);
  }
}

/**
 * POST /api/analysis-jobs
 * Submits content for analysis. Returns the jobId immediately.
 */
export async function submitAnalysisJob(
  payload: SubmitJobPayload,
): Promise<SubmitJobResponse> {
  if (!payload.content && !payload.file) {
    throw new Error('At least one of content or file must be provided.');
  }

  const formData = new FormData();

  if (payload.content) {
    formData.append('content', payload.content);
  }

  if (payload.file) {
    formData.append('file', {
      uri: payload.file.uri,
      name: payload.file.name,
      type: payload.file.mimeType,
    } as unknown as Blob);
  }

  if (payload.inputType) {
    formData.append('inputType', payload.inputType);
  }

  if (payload.title) {
    formData.append('title', payload.title);
  }

  if (payload.inputSource) {
    formData.append('inputSource', payload.inputSource);
  }

  if (payload.businessContext) {
    formData.append('businessContext', payload.businessContext);
  }

  if (payload.simulationSettings) {
    formData.append(
      'simulationSettings',
      JSON.stringify(payload.simulationSettings),
    );
  }

  const response = await fetch(`${API_BASE_URL}/api/analysis-jobs`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const result = await response.json();
  return { jobId: result.data.jobId };
}

/**
 * GET /api/analysis-jobs/:jobId
 * Returns the current status and active graph node of an analysis job.
 */
export async function getAnalysisJob(jobId: string): Promise<AnalysisJob> {
  const response = await fetch(`${API_BASE_URL}/api/analysis-jobs/${jobId}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const result = await response.json();
  return (result.data?.job ?? result.data) as AnalysisJob;
}

/**
 * GET /api/analysis-jobs/:jobId/result
 * Returns the full structured result once the workflow has produced it.
 */
export async function getAnalysisResult(
  jobId: string,
): Promise<AnalysisResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/analysis-jobs/${jobId}/result`,
    {
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseError(response);
  }

  const result = await response.json();
  return result.data as AnalysisResult;
}

/**
 * POST /api/analysis-jobs/:jobId/actions/:actionId/simulate
 * Triggers Workflow 2 and returns the simulation record with its Firestore ID.
 */
export async function simulateAnalysisAction(
  jobId: string,
  actionId: string,
): Promise<SimulationRecord> {
  const response = await fetch(
    `${API_BASE_URL}/api/analysis-jobs/${jobId}/actions/${actionId}/simulate`,
    {
      method: 'POST',
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseError(response);
  }

  const result = await response.json();
  return result.data.simulationRecord as SimulationRecord;
}

/**
 * GET /api/analysis-jobs/:jobId/simulations/:simulationId
 * Fetches a specific simulation record by its Firestore document ID.
 */
export async function getSimulationRecord(
  jobId: string,
  simulationId: string,
): Promise<SimulationRecord> {
  const response = await fetch(
    `${API_BASE_URL}/api/analysis-jobs/${jobId}/simulations/${simulationId}`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw await parseError(response);
  }

  const result = await response.json();
  return result.data.simulationRecord as SimulationRecord;
}
