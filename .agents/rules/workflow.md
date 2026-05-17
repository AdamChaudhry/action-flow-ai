---
trigger: always_on
---

# Workflow Guide — Two LangGraph Workflows

---

## Architecture Overview

ActionFlow AI uses **two separate LangGraph workflows** triggered by different API calls.

```
┌──────────────────────────────────────────────────────────────┐
│  Workflow 1 — Analysis                                       │
│  Trigger: POST /api/analysis-jobs                            │
│                                                              │
│  IngestInputNode → NormalizeContentNode                      │
│      → ContentToActionNode[LLM] → END                        │
│                                                              │
│  NormalizeContentNode also:                                  │
│    - builds BaselineState (deterministic, no LLM)            │
│    - persists it to Firestore                                │
│                                                              │
│  ContentToActionNode also:                                   │
│    - creates PendingApproval records                         │
│    - sets job status → waiting_for_user                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Workflow 2 — Execution                                      │
│  Trigger: POST /api/analysis-jobs/:jobId/actions/            │
│                          :actionId/simulate                  │
│                                                              │
│  ExecutionNode[LLM] → OutcomeStateNode → END                 │
│                                                              │
│  ExecutionNode:                                              │
│    - loads action + baselineState from Firestore             │
│    - calls ActionSimulation Agent (Gemini)                   │
│    - generates before/after state comparison                 │
│                                                              │
│  Job status stays waiting_for_user throughout.               │
└──────────────────────────────────────────────────────────────┘
```

---

## Workflow 1 — Analysis

**File:** `apps/api/src/workflows/analysis.workflow.ts`  
**Builder:** `buildAnalysisGraph(deps)`  
**Execution:** Fire-and-forget (HTTP returns `jobId` immediately)

### Node 1 — IngestInputNode

**Progress:** 10% | **Saves:** job status + currentNode | **Emits:** `job_started`

- Validates `rawInput` is not empty.
- Sets job `status = processing`.

**Throws:** `VALIDATION_ERROR: rawInput is empty`

---

### Node 2 — NormalizeContentNode

**Progress:** 20% | **Emits:** `content_normalized`

**Saves to Firestore:**
- `analysisResults/{jobId}` — creates document with `normalizedContent` + `baselineState`
- `analysisJobs/{jobId}` — `currentNode`, `progress`

**BaselineState extraction (deterministic, no LLM):**

```typescript
interface BaselineState {
  metrics: Record<string, string | number | boolean | null>; // regex-extracted numerics
  facts: string[];       // fact-signal sentences from the content
  constraints: string[]; // baseline dimensions that are absent in the input
  capturedAt: string;    // ISO 8601
}
```

Example from `"Support tickets up 40% this month. Top complaint: checkout failures."`

```json
{
  "metrics": {
    "support_tickets": "40%",
    "conversionRate": "unknown",
    "churnRate": "unknown"
  },
  "facts": [
    "Support ticket volume increased 40% this month.",
    "Top complaint is checkout failures on mobile."
  ],
  "constraints": [
    "No revenue baseline provided",
    "No conversion-rate metric provided"
  ],
  "capturedAt": "2026-05-17T17:00:00.000Z"
}
```

---

### Node 3 — ContentToActionNode ← LLM Call (Gemini 2.5 Flash)

**Progress:** 60% | **Emits:** `node_started`, `content_analyzed`, `awaiting_approval`

**Saves to Firestore (3 writes):**
1. `analysisResults/{jobId}` — `insights[]`, `implications[]`, `recommendedActions[]`
2. `analysisResults/{jobId}` — `pendingApprovals[]` (one per actionable action)
3. `analysisJobs/{jobId}` — `status = waiting_for_user`, `clarificationQuestion`

This is the **terminal node** of workflow 1. Workflow ends here.

---

## Workflow 2 — Execution

**File:** `apps/api/src/workflows/execution.workflow.ts`  
**Builder:** `buildExecutionGraph(deps)`  
**Execution:** Synchronous — awaited by controller, simulation returned in HTTP response

**Initial state:** `{ jobId, currentActionId }` — only these two fields are set.

### Node 1 — ExecutionNode ← LLM Call (Gemini 2.5 Flash)

**Progress:** 50% | **Emits:** `action_simulated`

**Reads from Firestore:**
- `analysisResults/{jobId}` — `recommendedActions[]`, `baselineState`, `normalizedContent`

**Saves to Firestore:**
- `analysisResults/{jobId}.simulations[]` — appends via `arrayUnion` (non-destructive)
- `analysisJobs/{jobId}` — `currentNode`, `progress`

**LLM call:** `ActionSimulation Agent`

Inputs to the agent:
- The target `RecommendedAction`
- The `BaselineState` (captured during NormalizeContentNode)
- First 4,000 chars of `normalizedContent` (evidence reference)

Agent output — the full `ActionSimulation` payload:

```typescript
interface ActionSimulation {
  // Identity (merged from action data)
  actionId: string;
  actionTitle: string;
  actionType: ActionType;
  parameters: Record<string, unknown>;
  estimatedRisk: 'low' | 'medium' | 'high'; // derived from priority
  requiresHumanApproval: boolean;

  // Before / After comparison (LLM-generated)
  beforeState: Record<string, unknown>;        // mirrors baseline metrics
  simulatedAfterState: Record<string, unknown>; // projected state after action
  expectedChanges: SimulatedChange[];           // per-metric delta analysis

  // Quality metadata
  projectedOutcome: string;
  confidence: number;        // 0.0 – 1.0
  assumptions: string[];
  risks: string[];
  evidenceUsed: string[];    // direct quotes / paraphrases from original content
}

interface SimulatedChange {
  metric: string;
  before: string | number | boolean | null;
  after: string | number | boolean | null;
  direction: 'increase' | 'decrease' | 'no_change' | 'unknown';
  confidence: number;
  rationale: string;
}
```

**State returned:** `{ currentSimulation: ActionSimulation }`

---

### Node 2 — OutcomeStateNode

**Progress:** 90% | **Emits:** `outcome_updated`

**Reads from Firestore:**
- `analysisResults/{jobId}` — full result including newly appended simulation

**Saves to Firestore:**
- `analysisResults/{jobId}.outcome` — rebuilt `OutcomeState`
- `analysisJobs/{jobId}` — `currentNode`, `progress`

Job status remains `waiting_for_user`.

---

## Firestore Write Map

| Node | Collection | Fields Written |
|---|---|---|
| IngestInputNode | `analysisJobs/{jobId}` | `status=processing`, `currentNode`, `progress` |
| NormalizeContentNode | `analysisResults/{jobId}` | `normalizedContent`, `baselineState` (creates doc) |
| NormalizeContentNode | `analysisJobs/{jobId}` | `currentNode`, `progress` |
| ContentToActionNode | `analysisResults/{jobId}` | `insights`, `implications`, `recommendedActions` |
| ContentToActionNode | `analysisResults/{jobId}` | `pendingApprovals[]` |
| ContentToActionNode | `analysisJobs/{jobId}` | `status=waiting_for_user`, `clarificationQuestion` |
| ExecutionNode | `analysisResults/{jobId}` | `simulations[]` (arrayUnion) |
| ExecutionNode | `analysisJobs/{jobId}` | `currentNode`, `progress` |
| OutcomeStateNode | `analysisResults/{jobId}` | `outcome` |
| OutcomeStateNode | `analysisJobs/{jobId}` | `currentNode`, `progress` |

---

## LLM Architecture

```
Workflow 1 — ContentToActionNode
  → runContentToActionAgent()           (agents/content-to-action.agent.ts)
      → GeminiService.call()
          → Gemini 2.5 Flash

Workflow 2 — ExecutionNode
  → runActionSimulationAgent()          (agents/action-simulation.agent.ts)
      → GeminiService.call()
          → Gemini 2.5 Flash
```

Two agents, two prompts, one shared `GeminiService`.

---

## WebSocket Event Sequence

### Workflow 1

```
job_started          { inputType, inputSource }
content_normalized   { normalizedLength }
node_started         { node: "ContentToActionNode" }
content_analyzed     { insightCount, implicationCount, actionCount }
awaiting_approval    { pendingApprovals: [...] }   ← workflow 1 complete
```

### Workflow 2 (one call per action simulated)

```
action_simulated     { simulation: ActionSimulation }   ← ExecutionNode
outcome_updated      { outcome: OutcomeState }          ← OutcomeStateNode
```

---

## Recommended Client Flow

```
1. POST /api/analysis-jobs
   ← { jobId }

2. Subscribe WebSocket
   ← awaiting_approval   (workflow 1 complete)

3. For each action to review before approving:
   POST /api/analysis-jobs/:jobId/actions/:actionId/simulate
   ← HTTP: { simulation }          (actionId, beforeState, simulatedAfterState, …)
   ← WS:   action_simulated
   ← WS:   outcome_updated

4. GET /api/analysis-jobs/:jobId/result
   ← full result with simulations[], baselineState, pendingApprovals[], outcome
```

---

## Firestore Document Schema

### `analysisJobs/{jobId}`

```
status              queued | processing | waiting_for_user | failed
currentNode         active node name
progress            0–100
clarificationQuestion  hint about the simulate endpoint
```

### `analysisResults/{jobId}`

```
normalizedContent   string
baselineState       { metrics, facts, constraints, capturedAt }  ← set by Node 2
insights[]          set by Node 3
implications[]      set by Node 3
recommendedActions[]set by Node 3
pendingApprovals[]  set by Node 3
simulations[]       APPENDED on each simulate call (ExecutionNode)
  └── beforeState
  └── simulatedAfterState
  └── expectedChanges[]
  └── projectedOutcome
  └── confidence
  └── assumptions[]
  └── risks[]
  └── evidenceUsed[]
outcome             rebuilt by OutcomeStateNode after each simulate call
```
