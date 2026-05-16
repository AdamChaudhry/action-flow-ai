// ─── Input / Job Types ────────────────────────────────────────────────────────

export type InputType =
  | 'text'
  | 'pdf'
  | 'image'
  | 'dashboard_screenshot'
  | 'mixed';

export type JobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'waiting_for_user';

// ─── File Attachment ──────────────────────────────────────────────────────────

export interface PickedFile {
  uri: string;
  name: string;
  mimeType: string;
}

// ─── API Payload ──────────────────────────────────────────────────────────────

export interface SubmitJobPayload {
  content?: string;
  file?: PickedFile;
  inputType?: InputType;
  title?: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface SubmitJobResponse {
  jobId: string;
}

export interface AnalysisJob {
  id: string;
  status: JobStatus;
  currentStep: string | null;
  progress: number;
  inputType: string;
  title: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── WebSocket Messages ───────────────────────────────────────────────────────

export type WsEventType =
  | 'planner_decision'
  | 'step_started'
  | 'step_completed'
  | 'step_evaluated'
  | 'analysis_needs_clarification'
  | 'analysis_completed'
  | 'analysis_failed'
  | 'analysis_started'
  | 'analysis_progress';

export interface WsMessage<T = Record<string, unknown>> {
  type: WsEventType;
  jobId: string;
  payload: T;
}

export interface StepStartedPayload {
  step: string;
}

export interface StepCompletedPayload {
  step: string;
  output: unknown;
}

export interface AnalysisFailedPayload {
  error: {
    code: string;
    message: string;
  };
}

export interface AnalysisClarificationPayload {
  question: string;
}
