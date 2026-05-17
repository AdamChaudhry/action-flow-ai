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

export type InsightCategory =
  | 'risk'
  | 'opportunity'
  | 'trend'
  | 'anomaly'
  | 'operational_issue'
  | 'customer_issue'
  | 'financial_issue'
  | 'compliance_issue'
  | 'strategic_issue';

export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Insight {
  id: string;            // insight_1, insight_2 …
  title: string;
  description: string;
  summary?: string;
  category: InsightCategory;
  importance?: ImportanceLevel | string | null;
  confidence: number;    // 0.0 – 1.0
  evidence: string[] | string;    // quoted/paraphrased from input
  whyItMatters?: string;
  relatedEntities?: string[];
}

// ─── Implication ──────────────────────────────────────────────────────────────

export type ImplicationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ImplicationUrgency  = 'low' | 'medium' | 'high';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Implication {
  id: string;                   // implication_1, implication_2 …
  relatedInsightIds: string[];  // references insight IDs
  severity: ImplicationSeverity;
  businessImpact: string;
  affectedAreas: string[];
  urgency: ImplicationUrgency;
}

// ─── RecommendedAction ────────────────────────────────────────────────────────

export type ActionType =
  | 'notify'
  | 'assign_task'
  | 'update_dashboard'
  | 'escalate'
  | 'create_ticket'
  | 'prepare_draft'
  | 'request_human_review'
  | 'no_action';

export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RecommendedAction {
  id: string;                       // action_1, action_2 …
  relatedImplicationIds: string[];
  title: string;
  description: string;
  actionType: ActionType;
  priority: ActionPriority;
  requiresHumanApproval: boolean;
  expectedImpact: string;
  parameters: Record<string, unknown>;
}

export interface PendingApproval {
  actionId: string;
  actionTitle: string;
  actionType: ActionType | string;
  parameters: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | string;
  requestedAt: string;
}

export interface ActionSimulation {
  actionId: string;
  actionTitle: string;
  actionType: ActionType | string;
  parameters: Record<string, unknown>;
  projectedOutcome: string;
  estimatedRisk: 'low' | 'medium' | 'high' | string;
  requiresHumanApproval: boolean;
}

// ─── Analysis Result ──────────────────────────────────────────────────────────

export interface AnalysisResult {
  jobId: string;
  normalizedContent?: string;
  insights?: Insight[];
  implications?: Implication[];
  recommendedActions?: RecommendedAction[];
  simulations?: ActionSimulation[];
  pendingApprovals?: PendingApproval[];
  executedActions?: unknown[];
  outcome?: WorkflowOutcome | null;
  createdAt?: string;
  updatedAt: string;
}

export type WsEventType =
  | 'job_started'
  | 'content_normalized'
  | 'node_started'
  | 'content_analyzed'
  | 'awaiting_approval'
  | 'action_simulated'
  | 'outcome_updated'
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

export interface AwaitingApprovalPayload {
  pendingApprovals: PendingApproval[];
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

export interface ActionSimulatedPayload {
  simulation: ActionSimulation;
}

export interface OutcomeUpdatedPayload {
  outcome: WorkflowOutcome;
}

export interface WorkflowFailedPayload {
  error: {
    code: string;
    message: string;
  };
}
