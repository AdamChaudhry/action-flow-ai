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

Submit content for analysis. Returns a `jobId` immediately. The 7-node LangGraph workflow runs asynchronously in the background.

### Request

**Content-Type:** `multipart/form-data`  
**Headers:** `x-user-id: <userId>` *(required)*

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | `string` | Conditional* | Plain text content to analyze |
| `file` | `File` | Conditional* | PDF or image file (max **20 MB**) |
| `inputType` | `string` | Optional | `text` \| `pdf` \| `image` \| `dashboard_screenshot` \| `mixed` |
| `title` | `string` | Optional | Human-readable label for this job |
| `inputSource` | `string` | Optional | Where the content came from (e.g. `"customer_feedback_portal"`, `"slack"`) |
| `businessContext` | `string` | Optional | Context about your business to improve LLM output (e.g. `"B2B SaaS platform for SMEs"`) |
| `simulationSettings` | `string` | Optional | JSON string — see below |

> **\*** At least one of `content` or `file` must be provided.

#### `simulationSettings` (JSON string)

```json
{
  "preferredActionId": "action_1"
}
```

### Response `201 Created`

```json
{
  "success": true,
  "data": {
    "jobId": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b"
  }
}
```

### Examples

#### Text analysis with business context

```bash
curl -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "content=Support ticket volume increased 40% this month. Top complaint: checkout failures on mobile." \
  -F "title=Monthly Support Spike" \
  -F "inputSource=zendesk" \
  -F "businessContext=E-commerce SaaS platform, 50k monthly active users"
```

#### File upload

```bash
curl -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "file=@/path/to/report.pdf" \
  -F "inputType=pdf" \
  -F "title=Board Report" \
  -F "businessContext=Healthcare logistics company"
```

### Error Responses

| Status | Code | Cause |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Neither `content` nor `file` provided |
| `400` | `BAD_REQUEST` | `simulationSettings` is not valid JSON |
| `401` | `UNAUTHORIZED` | Missing `x-user-id` header |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

---

## GET /api/analysis-jobs/:jobId

Returns the current status and active node of a job.

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b",
    "status": "processing",
    "currentNode": "ContentToActionNode",
    "progress": 40,
    "inputType": "text",
    "title": "Monthly Support Spike",
    "error": null,
    "clarificationQuestion": null,
    "createdAt": "2026-05-17T04:00:00.000Z",
    "updatedAt": "2026-05-17T04:00:08.123Z"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `status` | `string` | See [Job Status](#job-status-values) |
| `currentNode` | `string \| null` | The graph node currently executing |
| `progress` | `number` | Overall progress `0–100` |
| `clarificationQuestion` | `string \| null` | Set when `status = "waiting_for_user"` |

#### Job Status Values

| Status | Description |
|---|---|
| `queued` | Job created, not yet started |
| `processing` | Workflow running |
| `completed` | All nodes finished |
| `failed` | Workflow terminated with an error |
| `waiting_for_user` | Actions pending human approval |

#### Node Progress Map

| Node | `currentNode` | Progress % |
|---|---|---|
| Node 1 | `IngestInputNode` | 10% |
| Node 2 | `NormalizeContentNode` | 20% |
| Node 3 | `ContentToActionNode` | 40% |
| Node 4 | `DecisionRouterNode` | 55% |
| Node 5 | `SimulationNode` | 70% |
| Node 6 | `ApprovalOrExecutionNode` | 85% |
| Node 7 | `OutcomeStateNode` | 95% → 100% |

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
    "simulations": [ ... ],
    "pendingApprovals": [ ... ],
    "executedActions": [ ... ],
    "outcome": { ... },
    "updatedAt": "2026-05-17T04:01:45.000Z"
  }
}
```

All nested objects are documented in [Data Models](./data-models.md).

> Fields populate progressively. `insights`, `implications`, and `recommendedActions` are set after Node 3. `simulations`, `pendingApprovals`, `executedActions` after Nodes 5–6. `outcome` after Node 7.

### Error Responses

| Status | Code | Cause |
|---|---|---|
| `401` | `UNAUTHORIZED` | Missing `x-user-id` header |
| `404` | `NOT_FOUND` | No result found for this `jobId` |
| `500` | `INTERNAL_ERROR` | Unexpected server error |
