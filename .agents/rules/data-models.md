---
trigger: always_on
---

# Data Models

Complete TypeScript type definitions for all request and response objects.

---

## Job Objects

### AnalysisJob

Returned by `GET /api/analysis-jobs/:jobId`.

```typescript
interface AnalysisJob {
  id: string;
  userId: string;
  status: AnalysisJobStatus;
  inputType: InputType;
  title?: string;
  content?: string;
  storagePath?: string;
  storageFileName?: string;
  storageMimeType?: string;
  currentNode?: string;         // Active workflow node name
  progress: number;             // 0–100
  error?: string;
  clarificationQuestion?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `AnalysisJobStatus`
```typescript
type AnalysisJobStatus =
  | 'queued'            // Job created
  | 'processing'        // Workflow running
  | 'completed'         // All nodes finished
  | 'failed'            // Workflow terminated with error
  | 'waiting_for_user'; // Actions pending human approval
```

#### `InputType`
```typescript
type InputType = 'text' | 'pdf' | 'image' | 'dashboard_screenshot' | 'mixed';
```

---

## Result Objects

Returned by `GET /api/analysis-jobs/:jobId/result`. Fields are populated progressively.

### AnalysisResult (top-level)

```typescript
interface AnalysisResult {
  jobId: string;
  normalizedContent: string;
  // Set by Node 3 — ContentToActionNode
  insights?: Insight[];
  implications?: Implication[];
  recommendedActions?: RecommendedAction[];
  // Set by Node 5 — SimulationNode
  simulations?: ActionSimulation[];
  // Set by Node 6 — ApprovalOrExecutionNode
  pendingApprovals?: PendingApproval[];
  executedActions?: ExecutedAction[];
  // Set by Node 7 — OutcomeStateNode
  outcome?: OutcomeState;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Insight

Produced by the single LLM call (ContentToActionNode). Up to 5 per job.

```typescript
type InsightCategory =
  | 'risk' | 'opportunity' | 'trend' | 'anomaly'
  | 'operational_issue' | 'customer_issue' | 'financial_issue'
  | 'compliance_issue' | 'strategic_issue';

interface Insight {
  id: string;               // insight_1, insight_2 …
  title: string;
  description: string;
  category: InsightCategory;
  confidence: number;       // 0.0 – 1.0
  evidence: string[];       // quoted/paraphrased from input
}
```

**Example:**
```json
{
  "id": "insight_1",
  "title": "Mobile Checkout Failure Spike",
  "description": "A 40% increase in support tickets driven by checkout failures on mobile devices indicates a critical customer-facing bug.",
  "category": "customer_issue",
  "confidence": 0.91,
  "evidence": [
    "Support ticket volume increased 40% this month",
    "Top complaint: checkout failures on mobile"
  ]
}
```

---

### Implication

Up to 5 per job. Each links to one or more insights.

```typescript
type ImplicationSeverity = 'low' | 'medium' | 'high' | 'critical';
type ImplicationUrgency  = 'low' | 'medium' | 'high';

interface Implication {
  id: string;                  // implication_1, implication_2 …
  relatedInsightIds: string[]; // references insight IDs
  severity: ImplicationSeverity;
  businessImpact: string;
  affectedAreas: string[];
  urgency: ImplicationUrgency;
}
```

**Example:**
```json
{
  "id": "implication_1",
  "relatedInsightIds": ["insight_1"],
  "severity": "high",
  "businessImpact": "Mobile checkout failures are blocking conversions and driving customer churn.",
  "affectedAreas": ["engineering", "sales", "customers"],
  "urgency": "high"
}
```

---

### RecommendedAction

Up to 5 per job. Each links to one or more implications.

```typescript
type ActionType =
  | 'notify' | 'assign_task' | 'update_dashboard' | 'escalate'
  | 'create_ticket' | 'prepare_draft' | 'request_human_review' | 'no_action';

type ActionPriority = 'low' | 'medium' | 'high' | 'critical';

interface RecommendedAction {
  id: string;                       // action_1, action_2 …
  relatedImplicationIds: string[];  // references implication IDs
  title: string;
  description: string;
  actionType: ActionType;
  priority: ActionPriority;
  requiresHumanApproval: boolean;
  expectedImpact: string;
  parameters: Record<string, unknown>;
}
```

**`requiresHumanApproval` rules:**

| `true` when | `false` when |
|---|---|
| Sends message to customers | Creates internal task |
| Affects public content | Updates internal dashboard |
| Touches payments / billing | Assigns internal review |
| Escalates to leadership | Logs a risk |
| Affects production systems | Prepares a draft |

**Example (requires approval):**
```json
{
  "id": "action_1",
  "relatedImplicationIds": ["implication_1"],
  "title": "Send Incident Notification to Affected Users",
  "description": "Notify enterprise customers who experienced checkout failures in the past 7 days.",
  "actionType": "notify",
  "priority": "high",
  "requiresHumanApproval": true,
  "expectedImpact": "Reduces churn risk by proactively addressing affected customers.",
  "parameters": {
    "channel": "email",
    "segment": "enterprise",
    "lookbackDays": 7
  }
}
```

**Example (auto-execute):**
```json
{
  "id": "action_2",
  "relatedImplicationIds": ["implication_1"],
  "title": "Create Mobile Checkout Bug Ticket",
  "description": "Open an engineering ticket to investigate and fix mobile checkout failures.",
  "actionType": "create_ticket",
  "priority": "critical",
  "requiresHumanApproval": false,
  "expectedImpact": "Triggers immediate engineering investigation.",
  "parameters": {
    "team": "engineering",
    "label": "bug",
    "priority": "critical",
    "title": "Mobile checkout failure spike — 40% ticket volume increase"
  }
}
```

---

### ActionSimulation

Produced by **Node 5 — SimulationNode** (code-only, no LLM). One entry per auto-executable action.

```typescript
interface ActionSimulation {
  actionId: string;
  actionTitle: string;
  actionType: ActionType;
  parameters: Record<string, unknown>;
  projectedOutcome: string;
  estimatedRisk: 'low' | 'medium' | 'high';
  requiresHumanApproval: false; // always false in simulation
}
```

**Estimated risk derivation:**
- `high`: priority = `critical` OR actionType = `escalate`
- `medium`: priority = `high`
- `low`: everything else

---

### PendingApproval

Produced by **Node 6 — ApprovalOrExecutionNode** for actions where `requiresHumanApproval = true`.

```typescript
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface PendingApproval {
  actionId: string;
  actionTitle: string;
  actionType: ActionType;
  parameters: Record<string, unknown>;
  status: ApprovalStatus;
  requestedAt: string; // ISO 8601
}
```

---

### ExecutedAction

Produced by **Node 6 — ApprovalOrExecutionNode** for actions where `requiresHumanApproval = false`.

```typescript
type ExecutionStatus = 'queued' | 'simulated' | 'skipped';

interface ExecutedAction {
  actionId: string;
  actionTitle: string;
  actionType: ActionType;
  status: ExecutionStatus;
  executedAt: string; // ISO 8601
}
```

> `status: 'queued'` means the action has been handed off to the downstream execution system. No real-world side effects occur within this workflow.

---

### OutcomeState

Produced by **Node 7 — OutcomeStateNode** (code-only, no LLM).

```typescript
interface OutcomeState {
  totalInsights: number;
  totalImplications: number;
  totalActions: number;
  actionsRequiringApproval: number;
  actionsAutoQueued: number;
  highPriorityActions: string[];  // action IDs with priority: high | critical
  criticalInsights: string[];     // insight IDs with confidence >= 0.8
  summary: string;                // human-readable summary built from metadata
  completedAt: string;            // ISO 8601
}
```

**Example:**
```json
{
  "totalInsights": 3,
  "totalImplications": 3,
  "totalActions": 4,
  "actionsRequiringApproval": 1,
  "actionsAutoQueued": 3,
  "highPriorityActions": ["action_1", "action_2"],
  "criticalInsights": ["insight_1"],
  "summary": "Identified 3 insight(s) and 3 implication(s). Generated 4 recommended action(s). 2 action(s) are high or critical priority. 1 action(s) require human approval before execution. 3 action(s) have been queued for automatic execution.",
  "completedAt": "2026-05-17T04:01:45.000Z"
}
```

---

## Input Objects

### SimulationSettings

Passed in `POST /api/analysis-jobs` body as a JSON string.

```typescript
interface SimulationSettings {
  preferredActionId?: string;
  [key: string]: unknown;
}
```
