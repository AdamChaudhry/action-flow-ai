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

export interface PickedFile {
  uri: string;
  name: string;
  mimeType: string;
}

export interface SimulationSettings {
  preferredActionId?: string;
}

export interface SubmitJobPayload {
  content?: string;
  file?: PickedFile;
  inputType?: InputType;
  title?: string;
  inputSource?: string;
  businessContext?: string;
  simulationSettings?: SimulationSettings;
}

export interface SubmitJobResponse {
  jobId: string;
}

export interface AnalysisJob {
  id: string;
  status: JobStatus;
  currentNode: string | null;
  progress: number;
  inputType: string;
  title: string | null;
  error: string | null;
  clarificationQuestion: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Insight ──────────────────────────────────────────────────────────────────

export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Insight {
  id: string;
  title: string;
  summary: string;
  category: string;
  importance?: ImportanceLevel | string | null;
  /** Confidence score 0–1 */
  confidence: number;
  evidence: string;
  whyItMatters: string;
  relatedEntities: string[];
}

// ─── Analysis Result ──────────────────────────────────────────────────────────

export interface AnalysisResult {
  jobId: string;
  insights: Insight[];
  implications: unknown[];
  recommendedActions: unknown[];
  simulations: unknown[];
  pendingApprovals: unknown[];
  executedActions: unknown[];
  outcome: WorkflowOutcome | null;
  updatedAt: string;
}

export type WsEventType =
  | 'job_started'
  | 'content_normalized'
  | 'node_started'
  | 'content_analyzed'
  | 'actions_routed'
  | 'simulation_ready'
  | 'awaiting_approval'
  | 'actions_queued'
  | 'workflow_completed'
  | 'workflow_failed';

export interface WsMessage<T = unknown> {
  type: WsEventType;
  jobId: string;
  payload: T;
}

export interface JobStartedPayload {
  jobId: string;
  inputType: InputType | string;
  inputSource?: string;
}

export interface ContentNormalizedPayload {
  normalizedLength: number;
}

export interface NodeStartedPayload {
  node: string;
}

export interface ContentAnalyzedPayload {
  insightCount: number;
  implicationCount: number;
  actionCount: number;
}

export interface ActionsRoutedPayload {
  requiresApprovalCount: number;
  autoExecuteCount: number;
}

export interface SimulationReadyPayload {
  simulations: unknown[];
}

export interface AwaitingApprovalPayload {
  pendingApprovals: unknown[];
}

export interface ActionsQueuedPayload {
  executedActions: unknown[];
}

export interface WorkflowOutcome {
  totalInsights: number;
  totalImplications: number;
  totalActions: number;
  actionsRequiringApproval: number;
  actionsAutoQueued: number;
  highPriorityActions: string[];
  criticalInsights: string[];
  summary: string;
  completedAt: string;
}

export interface WorkflowCompletedPayload {
  outcome: WorkflowOutcome;
}

export interface WorkflowFailedPayload {
  error: {
    code: string;
    message: string;
  };
}
