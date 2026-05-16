import { API_BASE_URL, PLACEHOLDER_USER_ID } from '../constants/config';
import type { SubmitJobPayload, SubmitJobResponse, AnalysisJob } from '../types/analysis';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  return { 'x-user-id': PLACEHOLDER_USER_ID };
}

async function parseError(response: Response): Promise<Error> {
  try {
    const body = await response.json();
    return new Error(body?.message ?? `HTTP ${response.status}`);
  } catch {
    return new Error(`HTTP ${response.status}`);
  }
}

// ─── API Functions ────────────────────────────────────────────────────────────

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
 * Returns the current status and progress of an analysis job.
 */
export async function getAnalysisJob(jobId: string): Promise<AnalysisJob> {
  const response = await fetch(`${API_BASE_URL}/api/analysis-jobs/${jobId}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const result = await response.json();
  return result.data as AnalysisJob;
}
