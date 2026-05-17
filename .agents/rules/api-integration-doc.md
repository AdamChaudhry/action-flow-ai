---
trigger: always_on
---

# REST API Reference

**Base URL:** `http://localhost:3000`

---

## Endpoints Summary

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Server health check |
| `POST` | `/api/analysis-jobs` | ✅ | Submit content for analysis |
| `GET` | `/api/analysis-jobs/:jobId` | ✅ | Get job status and active node |
| `GET` | `/api/analysis-jobs/:jobId/result` | ✅ | Get full analysis result |
| `POST` | `/api/analysis-jobs/:jobId/actions/:actionId/simulate` | ✅ | Trigger Workflow 2 — simulate action vs baseline |
| `GET` | `/api/analysis-jobs/:jobId/simulations` | ✅ | Get all simulation records for a job |
| `GET` | `/api/analysis-jobs/:jobId/simulations/:simulationId` | ✅ | Get a specific simulation record by ID |

---

## GET /health

No authentication required.

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "1.0.0",
    "uptime": 142.35
  }
}
```

---

## POST /api/analysis-jobs

Submit content for analysis. Returns a `jobId` immediately. The 6-node LangGraph workflow runs asynchronously.

### Request

**Content-Type:** `multipart/form-data`  
**Headers:** `x-user-id: <userId>` *(required)*

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | `string` | Conditional* | Plain text content to analyze |
| `file` | `File` | Conditional* | PDF or image file (max **20 MB**) |
| `inputType` | `string` | Optional | `text` \| `pdf` \| `image` \| `dashboard_screenshot` \| `mixed` |
| `title` | `string` | Optional | Human-readable label for this job |
| `inputSource` | `string` | Optional | Where the content came from (e.g. `"zendesk"`, `"slack"`) |
| `businessContext` | `string` | Optional | Context about your business to improve LLM output |
| `simulationSettings` | `string` | Optional | JSON string of extra settings |

> **\*** At least one of `content` or `file` must be provided.

### Response `201 Created`

```json
{
  "success": true,
  "data": {
    "jobId": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b"
  }
}
```

### Example

```bash
curl -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "content=Support ticket volume increased 40% this month. Top complaint: checkout failures on mobile." \
  -F "title=Monthly Support Spike" \
  -F "inputSource=zendesk" \
  -F "businessContext=E-commerce SaaS platform, 50k monthly active users"
```

---

## GET /api/analysis-jobs/:jobId

Returns the current status and active node of a job.

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "3f7a2c91-...",
    "status": "waiting_for_user",
    "currentNode": "OutcomeStateNode",
    "progress": 100,
    "inputType": "text",
    "title": "Monthly Support Spike",
    "error": null,
    "clarificationQuestion": "3 action(s) require human approval. Simulate each action first via POST /api/analysis-jobs/.../actions/:actionId/simulate",
    "createdAt": "2026-05-17T04:00:00.000Z",
    "updatedAt": "2026-05-17T04:00:12.000Z"
  }
}
```

#### Job Status Values

| Status | Description |
|---|---|
| `queued` | Job created, workflow not yet started |
| `processing` | Workflow running |
| `waiting_for_user` | All actions are pending human approval — workflow complete |
| `failed` | Workflow terminated with an error |

> After a successful workflow run the status is always `waiting_for_user` — this is expected. All actions require review.

#### Node Progress Map (Workflow 1)

| Node | `currentNode` | Progress % |
|---|---|---|
| Node 1 | `IngestInputNode` | 10% |
| Node 2 | `NormalizeContentNode` | 20% |
| Node 3 | `ContentToActionNode` | 60% |

#### Node Progress Map (Workflow 2)

| Node | `currentNode` | Progress % |
|---|---|---|
| Node 1 | `ExecutionNode` | 50% |
| Node 2 | `OutcomeStateNode` | 90% |

---

## GET /api/analysis-jobs/:jobId/result

Returns the full structured analysis result.

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "jobId": "3f7a2c91-...",
    "insights": [ ... ],
    "implications": [ ... ],
    "recommendedActions": [ ... ],
    "simulations": [ ... ],         ← populated on-demand via the simulate endpoint
    "pendingApprovals": [ ... ],
    "executedActions": [],           ← always empty (no auto-execution)
    "outcome": { ... },
    "updatedAt": "2026-05-17T04:01:45.000Z"
  }
}
```

> `simulations` starts as an empty array after the workflow finishes. Each call to the simulate endpoint appends one entry.

---

## POST /api/analysis-jobs/:jobId/actions/:actionId/simulate ⭐

Triggers **Workflow 2 (Execution)**: `ExecutionNode → OutcomeStateNode → END`

Simulate a specific recommended action to preview its projected outcome before approving it.

- **No LLM is called** — simulation is deterministic and instant.
- `ExecutionNode` loads the action from Firestore, builds the simulation, and appends it via `arrayUnion`.
- `OutcomeStateNode` reads the full result from Firestore, rebuilds the outcome, and saves it.
- Both nodes emit WebSocket events: `action_simulated` and `outcome_updated`.

### Request

**Headers:** `x-user-id: <userId>` *(required)*  
**Body:** empty (no body required)

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "simulationRecord": {
      "id": "aB3xZ9kLm...",
      "jobId": "3f7a2c91-...",
      "actionId": "action_1",
      "createdAt": "2026-05-17T17:30:00.000Z",
      "simulation": {
        "actionId": "action_1",
        "actionTitle": "Send Incident Notification to Affected Mobile Users",
        "actionType": "notify",
        "parameters": { "channel": "email", "segment": "enterprise" },
        "estimatedRisk": "medium",
        "requiresHumanApproval": true,
        "beforeState": { "supportTickets": "40% above baseline", "customerSentiment": "negative" },
        "simulatedAfterState": { "supportTickets": "normalising", "customerSentiment": "improving" },
        "expectedChanges": [
          {
            "metric": "customerSentiment",
            "before": "negative",
            "after": "improving",
            "direction": "increase",
            "confidence": 0.72,
            "rationale": "Proactive communication reduces uncertainty."
          }
        ],
        "projectedOutcome": "Affected customers will be informed, reducing churn risk.",
        "confidence": 0.74,
        "assumptions": ["Email deliverability is functional"],
        "risks": ["May generate additional inbound queries"],
        "evidenceUsed": ["Support ticket volume increased 40%"]
      }
    }
  }
}
```

---

## GET /api/analysis-jobs/:jobId/simulations

Get all simulation records for a job, ordered by creation time.

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "simulations": [
      {
        "id": "aB3xZ9kLm...",
        "jobId": "3f7a2c91-...",
        "actionId": "action_1",
        "createdAt": "2026-05-17T17:30:00.000Z",
        "simulation": { ... }
      }
    ]
  }
}
```

---

## GET /api/analysis-jobs/:jobId/simulations/:simulationId

Get a specific simulation record by its Firestore-generated document ID.

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "simulationRecord": {
      "id": "aB3xZ9kLm...",
      "jobId": "3f7a2c91-...",
      "actionId": "action_1",
      "createdAt": "2026-05-17T17:30:00.000Z",
      "simulation": { ... }
    }
  }
}
```

### Error Responses

| Status | Code | Cause |
|---|---|---|
| `404` | `NOT_FOUND` | No simulation with this ID |

| Field | Type | Description |
|---|---|---|
| `actionId` | `string` | Echoed from the recommended action |
| `actionTitle` | `string` | Echoed from the recommended action |
| `actionType` | `string` | Action type used to determine projected outcome |
| `parameters` | `object` | Parameters the backend system would use |
| `projectedOutcome` | `string` | Deterministic description of what this action does |
| `estimatedRisk` | `string` | `low` \| `medium` \| `high` — derived from priority + actionType |
| `requiresHumanApproval` | `boolean` | Always `true` in current configuration |

#### Risk derivation

| Condition | `estimatedRisk` |
|---|---|
| `priority = critical` OR `actionType = escalate` | `high` |
| `priority = high` | `medium` |
| Everything else | `low` |

### Example

```bash
# 1. Submit a job
JOB_ID=$(curl -s -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "content=Support tickets up 40%. Top complaint: checkout failures on mobile." \
  | jq -r '.data.jobId')

# 2. Wait for workflow_completed WebSocket event, then simulate action_1
curl -X POST http://localhost:3000/api/analysis-jobs/$JOB_ID/actions/action_1/simulate \
  -H "x-user-id: user-123"

# 3. Simulate action_2
curl -X POST http://localhost:3000/api/analysis-jobs/$JOB_ID/actions/action_2/simulate \
  -H "x-user-id: user-123"

# 4. Get the full result with simulations attached
curl http://localhost:3000/api/analysis-jobs/$JOB_ID/result \
  -H "x-user-id: user-123"
```

### Error Responses

| Status | Code | Cause |
|---|---|---|
| `401` | `UNAUTHORIZED` | Missing `x-user-id` header |
| `404` | `NOT_FOUND` | No result for this `jobId`, or no action with this `actionId` |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

---

## Error Envelope

All errors follow the same shape:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

| Status | Code | Cause |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Neither `content` nor `file` provided |
| `400` | `BAD_REQUEST` | `simulationSettings` is not valid JSON |
| `401` | `UNAUTHORIZED` | Missing `x-user-id` header |
| `404` | `NOT_FOUND` | Job or action not found |
| `500` | `INTERNAL_ERROR` | Unhandled exception |
