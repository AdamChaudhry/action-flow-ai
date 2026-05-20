---
trigger: always_on
---

# WebSocket Reference

**WebSocket URL:** `ws://localhost:3000`  
**Protocol:** JSON messages over a plain WebSocket connection

---

## Connection

```
ws://localhost:3000
```

No authentication is required to open the connection. All events are scoped to a specific `jobId` — subscribe immediately after creating a job.

---

## Subscribing to a Job

Send this message after opening the connection:

```json
{
  "type": "subscribe_analysis",
  "payload": {
    "jobId": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b"
  }
}
```

You will then receive all events emitted for that job, including events from both workflows.

---

## Message Envelope

Every server-sent event follows this shape:

```json
{
  "type": "<event_type>",
  "jobId": "3f7a2c91-...",
  "payload": { ... }
}
```

---

## Event Reference

### `job_started`

Emitted by **IngestInputNode** after input validation passes.

```json
{
  "type": "job_started",
  "jobId": "...",
  "payload": {
    "jobId": "...",
    "inputType": "text",
    "inputSource": "zendesk"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `inputType` | `string` | `text`, `url`, `pdf`, `image`, `dashboard_screenshot`, or `mixed` |
| `inputSource` | `string \| undefined` | Where the content originated |

---

### `content_normalized`

Emitted by **NormalizeContentNode** after the input is cleaned and any embedded URLs are detected.

```json
{
  "type": "content_normalized",
  "jobId": "...",
  "payload": {
    "normalizedLength": 1842,
    "detectedUrlCount": 1
  }
}
```

| Field | Type | Description |
|---|---|---|
| `normalizedLength` | `number` | Character count of the cleaned content |
| `detectedUrlCount` | `number` | Number of `http(s)://` URLs found in the raw input. When > 0, Gemini's URL context is enabled. |

---

### `node_started`

Emitted before an LLM node or bridge node begins its work. May be emitted multiple times per job — once for `ContentToActionNode` and once for `EvaluationNode`.

```json
{
  "type": "node_started",
  "jobId": "...",
  "payload": {
    "node": "ContentToActionNode"
  }
}
```

| Field | Possible values |
|---|---|
| `node` | `"ContentToActionNode"`, `"EvaluationNode"` |

---

### `content_analyzed`

Emitted by **ContentToActionNode** after the Gemini analysis call completes.

```json
{
  "type": "content_analyzed",
  "jobId": "...",
  "payload": {
    "insightCount": 2,
    "implicationCount": 2,
    "actionCount": 2
  }
}
```

| Field | Type | Description |
|---|---|---|
| `insightCount` | `number` | Number of insights extracted |
| `implicationCount` | `number` | Number of implications analyzed |
| `actionCount` | `number` | Number of recommended actions generated |

---

### `awaiting_approval` ⭐ Workflow 1 Complete

Emitted by **ContentToActionNode** when pending approval records are created. Job status is set to `waiting_for_user`.  
This is the terminal event of Workflow 1. After this fires, the client can display actions for user review.

```json
{
  "type": "awaiting_approval",
  "jobId": "...",
  "payload": {
    "pendingApprovals": [
      {
        "actionId": "action_1",
        "actionTitle": "Escalate Checkout Failure to On-Call Engineering",
        "actionType": "escalate",
        "parameters": { "ownerTeam": "platform-engineering", "escalationLevel": "P1" },
        "status": "pending",
        "requestedAt": "2026-05-21T00:00:00.000Z"
      },
      {
        "actionId": "action_2",
        "actionTitle": "Prepare Customer Communication Draft",
        "actionType": "prepare_draft",
        "parameters": { "draftType": "incident-notification" },
        "status": "pending",
        "requestedAt": "2026-05-21T00:00:00.000Z"
      }
    ]
  }
}
```

---

### `action_simulated` ⭐ Simulation Complete

Emitted by **ExecutionNode** after a simulation is generated and persisted.

Fired in two scenarios:
1. **Automatic** — `EvaluationNode` selects the best candidate action and triggers Workflow 2 inline immediately after Workflow 1 completes.
2. **Manual** — Client calls `POST /api/analysis-jobs/:jobId/actions/:actionId/simulate`.

```json
{
  "type": "action_simulated",
  "jobId": "...",
  "payload": {
    "simulation": {
      "actionId": "action_1",
      "actionTitle": "Escalate Checkout Failure to On-Call Engineering",
      "actionType": "escalate",
      "parameters": { "ownerTeam": "platform-engineering", "escalationLevel": "P1" },
      "estimatedRisk": "high",
      "requiresHumanApproval": false,
      "beforeState": {
        "checkoutErrorRate": "340% above baseline",
        "engineeringEngagement": "none",
        "resolutionStatus": "untracked"
      },
      "simulatedAfterState": {
        "checkoutErrorRate": "under investigation",
        "engineeringEngagement": "P1 on-call engaged",
        "resolutionStatus": "in_progress"
      },
      "expectedChanges": [
        {
          "metric": "engineeringEngagement",
          "before": "none",
          "after": "P1 on-call engaged",
          "direction": "increase",
          "confidence": 0.95,
          "rationale": "The escalation was sent to the on-call team, who confirmed receipt and began investigation."
        }
      ],
      "projectedOutcome": "The P1 escalation was dispatched and the on-call engineering team was engaged immediately.",
      "confidence": 0.88,
      "assumptions": ["The on-call team had availability to respond within 5 minutes."],
      "risks": ["Root cause identification may take longer than expected."],
      "evidenceUsed": [
        "Checkout error rate increased by 340% over the last 2 hours on mobile.",
        "Revenue loss estimated at $40k/hour if checkout remains broken."
      ]
    }
  }
}
```

> **Note:** Simulation reports are written in **past tense**. They describe what was observed after the action was executed, not what will happen.

| Field | Description |
|---|---|
| `beforeState` | State derived from the related insights and implications before the action |
| `simulatedAfterState` | Projected state after the action was executed |
| `expectedChanges[]` | Per-metric delta with direction, confidence, and rationale |
| `projectedOutcome` | Short summary written in past tense |
| `confidence` | Overall simulation confidence (0.0 – 1.0) |
| `evidenceUsed` | Sourced from `insight.evidence` or `implication.businessImpact` |

---

### `outcome_updated`

Emitted by **OutcomeStateNode** after it rebuilds the outcome summary. Fired after every simulation (automatic or manual).

```json
{
  "type": "outcome_updated",
  "jobId": "...",
  "payload": {
    "outcome": {
      "totalInsights": 2,
      "totalImplications": 2,
      "totalActions": 2,
      "actionsRequiringApproval": 1,
      "actionsAutoQueued": 1,
      "highPriorityActions": ["action_1"],
      "criticalInsights": ["insight_1"],
      "summary": "Identified 2 insight(s) and 2 implication(s). Generated 2 recommended action(s). 1 action(s) are high or critical priority. 1 action(s) require human approval.",
      "completedAt": "2026-05-21T00:00:00.000Z"
    }
  }
}
```

---

### `workflow_failed` ⚠ Terminal

Emitted when a workflow terminates due to an unrecoverable error. Job status is set to `failed`.

```json
{
  "type": "workflow_failed",
  "jobId": "...",
  "payload": {
    "error": {
      "code": "GRAPH_ERROR",
      "message": "ContentToActionNode: normalizedContent is missing."
    }
  }
}
```

| Error Code | Cause |
|---|---|
| `GRAPH_ERROR` | Unhandled exception in the graph engine |
| `INSUFFICIENT_INPUT` | Input was too short, empty, unreadable, or lacked enough business-relevant information |

For `INSUFFICIENT_INPUT`, the payload includes `requiredInformation`:

```json
{
  "type": "workflow_failed",
  "jobId": "...",
  "payload": {
    "error": {
      "code": "INSUFFICIENT_INPUT",
      "message": "The provided input does not contain enough business-relevant information to extract insights, implications, and recommended actions.",
      "requiredInformation": [
        "Provide business context, report text, dashboard values, customer issue details, or operational data."
      ]
    }
  }
}
```

---

## Typical Event Sequence

### Workflow 1 — Analysis + Auto-Simulation

```
subscribe_analysis  (client → server)

[Workflow 1 — Analysis]
job_started             { inputType: "text" }
content_normalized      { normalizedLength: 1842, detectedUrlCount: 0 }
node_started            { node: "ContentToActionNode" }
content_analyzed        { insightCount: 2, implicationCount: 2, actionCount: 2 }
awaiting_approval       { pendingApprovals: [...] }      ← Workflow 1 complete

[Workflow 2 — Auto-simulation triggered by EvaluationNode]
node_started            { node: "EvaluationNode" }
action_simulated        { simulation: { ... } }          ← highest-priority action auto-simulated
outcome_updated         { outcome: { ... } }
```

### Workflow 2 — Manual Simulation

Triggered by `POST /api/analysis-jobs/:jobId/actions/:actionId/simulate`:

```
action_simulated        { simulation: { ... } }
outcome_updated         { outcome: { ... } }
```

---

## Recommended Client Handling

```
1. POST /api/analysis-jobs
   ← { jobId }

2. Open WebSocket, subscribe to jobId

3. On awaiting_approval:
   → Display pending actions to the user.
   → Do NOT show the simulate button for the auto-simulated action
     (wait for the action_simulated event first).

4. On action_simulated:
   → Look up simulation.actionId.
   → Display the before/after comparison for that action.
   → Mark that action as "simulated" in the UI.

5. On outcome_updated:
   → Update the summary panel.

6. For remaining actions the user wants to simulate:
   POST /api/analysis-jobs/:jobId/actions/:actionId/simulate
   ← HTTP: SimulationRecord (full simulation immediately)
   ← WS:   action_simulated + outcome_updated

7. GET /api/analysis-jobs/:jobId/simulations
   ← list of all SimulationRecord documents
```

---

## JavaScript Client Example

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe_analysis',
    payload: { jobId: 'your-job-id' }
  }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  switch (msg.type) {
    case 'job_started':
      console.log(`Job started — type: ${msg.payload.inputType}`);
      break;

    case 'content_normalized':
      console.log(
        `Content ready (${msg.payload.normalizedLength} chars, ` +
        `${msg.payload.detectedUrlCount} URL(s) detected)`
      );
      break;

    case 'node_started':
      console.log(`▶ ${msg.payload.node} running...`);
      break;

    case 'content_analyzed':
      console.log(
        `✓ AI complete — ${msg.payload.insightCount} insights, ` +
        `${msg.payload.actionCount} actions`
      );
      break;

    case 'awaiting_approval':
      console.log('⏳ Actions ready for review:', msg.payload.pendingApprovals.length);
      // Auto-simulation may follow immediately — wait for action_simulated
      break;

    case 'action_simulated':
      const sim = msg.payload.simulation;
      console.log(
        `✅ Simulation complete for "${sim.actionTitle}" ` +
        `(confidence: ${sim.confidence}, risk: ${sim.estimatedRisk})`
      );
      // Display before/after comparison for sim.actionId
      break;

    case 'outcome_updated':
      console.log('📊 Outcome updated:', msg.payload.outcome.summary);
      break;

    case 'workflow_failed':
      const err = msg.payload.error;
      console.error(`❌ Failed [${err.code}]: ${err.message}`);
      if (err.requiredInformation) {
        console.warn('Required:', err.requiredInformation);
      }
      ws.close();
      break;
  }
};
```
