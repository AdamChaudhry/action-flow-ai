# WebSocket Reference

**WebSocket URL:** `ws://localhost:3000`

---

## Connection

```
ws://localhost:3000
```

No authentication required to open the connection.

---

## Subscribing to a Job

```json
{
  "type": "subscribe_analysis",
  "payload": {
    "jobId": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b"
  }
}
```

---

## Message Envelope

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

Emitted by **Node 1 — IngestInputNode** after validation passes.

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
| `inputType` | `string` | The content input type |
| `inputSource` | `string \| undefined` | Where the content originated |

---

### `content_normalized`

Emitted by **Node 2 — NormalizeContentNode** after cleaning the input.

```json
{
  "type": "content_normalized",
  "jobId": "...",
  "payload": {
    "normalizedLength": 1842
  }
}
```

| Field | Type | Description |
|---|---|---|
| `normalizedLength` | `number` | Character count of the cleaned content (not the raw text) |

---

### `node_started`

Emitted by **Node 3 — ContentToActionNode** before the LLM call begins.

```json
{
  "type": "node_started",
  "jobId": "...",
  "payload": {
    "node": "ContentToActionNode"
  }
}
```

---

### `content_analyzed` ⭐

Emitted by **Node 3 — ContentToActionNode** after the single LLM call completes.  
This is the most important event — it means all AI work is done.

```json
{
  "type": "content_analyzed",
  "jobId": "...",
  "payload": {
    "insightCount": 3,
    "implicationCount": 3,
    "actionCount": 4
  }
}
```

| Field | Type | Description |
|---|---|---|
| `insightCount` | `number` | Number of insights extracted |
| `implicationCount` | `number` | Number of implications analyzed |
| `actionCount` | `number` | Number of recommended actions generated |

---

### `actions_routed`

Emitted by **Node 4 — DecisionRouterNode** after splitting actions by approval requirement.

```json
{
  "type": "actions_routed",
  "jobId": "...",
  "payload": {
    "requiresApprovalCount": 2,
    "autoExecuteCount": 2
  }
}
```

| Field | Type | Description |
|---|---|---|
| `requiresApprovalCount` | `number` | Actions that require human approval |
| `autoExecuteCount` | `number` | Actions safe to execute automatically |

---

### `simulation_ready`

Emitted by **Node 5 — SimulationNode** with projected outcomes for auto-executable actions.

```json
{
  "type": "simulation_ready",
  "jobId": "...",
  "payload": {
    "simulations": [
      {
        "actionId": "action_1",
        "actionTitle": "Create internal task",
        "actionType": "assign_task",
        "parameters": { "assignee": "engineering", "priority": "high" },
        "projectedOutcome": "A task will be created and assigned to the responsible team for resolution.",
        "estimatedRisk": "low",
        "requiresHumanApproval": false
      }
    ]
  }
}
```

---

### `awaiting_approval`

Emitted by **Node 6 — ApprovalOrExecutionNode** when one or more actions require human review.  
Job status is set to `waiting_for_user`.

```json
{
  "type": "awaiting_approval",
  "jobId": "...",
  "payload": {
    "pendingApprovals": [
      {
        "actionId": "action_2",
        "actionTitle": "Send churn alert to enterprise customers",
        "actionType": "notify",
        "parameters": { "channel": "email", "segment": "enterprise" },
        "status": "pending",
        "requestedAt": "2026-05-17T04:01:20.000Z"
      }
    ]
  }
}
```

---

### `actions_queued`

Emitted by **Node 6 — ApprovalOrExecutionNode** when auto-executable actions are queued.

```json
{
  "type": "actions_queued",
  "jobId": "...",
  "payload": {
    "executedActions": [
      {
        "actionId": "action_1",
        "actionTitle": "Create engineering ticket",
        "actionType": "create_ticket",
        "status": "queued",
        "executedAt": "2026-05-17T04:01:20.000Z"
      }
    ]
  }
}
```

---

### `workflow_completed` ✅ Terminal

Emitted by **Node 7 — OutcomeStateNode** when all nodes finish. Job status → `completed`.

```json
{
  "type": "workflow_completed",
  "jobId": "...",
  "payload": {
    "outcome": {
      "totalInsights": 3,
      "totalImplications": 3,
      "totalActions": 4,
      "actionsRequiringApproval": 2,
      "actionsAutoQueued": 2,
      "highPriorityActions": ["action_2", "action_3"],
      "criticalInsights": ["insight_1"],
      "summary": "Identified 3 insight(s) and 3 implication(s). Generated 4 recommended action(s). 2 action(s) require human approval before execution. 2 action(s) have been queued for automatic execution.",
      "completedAt": "2026-05-17T04:01:45.000Z"
    }
  }
}
```

---

### `workflow_failed` ✅ Terminal

Emitted when the workflow terminates due to an error.

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

---

## Typical Event Sequence

```
subscribe_analysis (client → server)

job_started            { inputType: "text", inputSource: "zendesk" }
content_normalized     { normalizedLength: 1842 }
node_started           { node: "ContentToActionNode" }
content_analyzed       { insightCount: 3, implicationCount: 3, actionCount: 4 }
actions_routed         { requiresApprovalCount: 2, autoExecuteCount: 2 }
simulation_ready       { simulations: [...] }
awaiting_approval      { pendingApprovals: [...] }   ← if any approvals needed
actions_queued         { executedActions: [...] }     ← if any auto actions
workflow_completed     { outcome: { ... } }
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
      console.log(`Content ready (${msg.payload.normalizedLength} chars)`);
      break;

    case 'node_started':
      console.log(`▶ ${msg.payload.node} running...`);
      break;

    case 'content_analyzed':
      console.log(`✓ AI complete — ${msg.payload.insightCount} insights, ${msg.payload.actionCount} actions`);
      break;

    case 'actions_routed':
      console.log(`Routing: ${msg.payload.requiresApprovalCount} need approval, ${msg.payload.autoExecuteCount} auto`);
      break;

    case 'simulation_ready':
      console.log('Simulations:', msg.payload.simulations);
      break;

    case 'awaiting_approval':
      console.warn('⏳ Human approval required:', msg.payload.pendingApprovals);
      break;

    case 'actions_queued':
      console.log('✓ Auto actions queued:', msg.payload.executedActions);
      break;

    case 'workflow_completed':
      console.log('✅ Done:', msg.payload.outcome.summary);
      ws.close();
      break;

    case 'workflow_failed':
      console.error('❌ Failed:', msg.payload.error.message);
      ws.close();
      break;
  }
};
```
