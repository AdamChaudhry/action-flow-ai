---
trigger: always_on
---

# REST API Reference

**Base URL:** `http://localhost:3000`  
**Content-Type:** `application/json` (except file upload endpoints)

---

## Endpoints Summary

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Server health check |
| `POST` | `/api/analysis-jobs` | ✅ | Submit content for analysis |
| `GET` | `/api/analysis-jobs/:jobId` | ✅ | Get job status and progress |
| `GET` | `/api/analysis-jobs/:jobId/result` | ✅ | Get full analysis result |

---

## GET /health

Returns server status. No authentication required.

### Request

```
GET /health
```

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

| Field | Type | Description |
|---|---|---|
| `status` | `string` | Always `"ok"` when healthy |
| `version` | `string` | Application version |
| `uptime` | `number` | Server uptime in seconds |

---

## POST /api/analysis-jobs

Submit content for analysis. Returns a `jobId` immediately. The LangGraph workflow runs asynchronously in the background.

### Request

**Content-Type:** `multipart/form-data`  
**Headers:** `x-user-id: <userId>` *(required)*

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | `string` | Conditional* | Plain text content to analyze |
| `file` | `File` | Conditional* | PDF or image file (max **20 MB**) |
| `inputType` | `string` | Optional | One of: `text`, `pdf`, `image`, `dashboard_screenshot`, `mixed`. Auto-detected if omitted. |
| `title` | `string` | Optional | Human-readable label for this analysis job |
| `simulationSettings` | `string` | Optional | JSON string with simulation preferences (see below) |

> **\*** At least one of `content` or `file` must be provided.

#### `simulationSettings` Object

```json
{
  "preferredActionId": "action-id-from-previous-result"
}
```

| Field | Type | Description |
|---|---|---|
| `preferredActionId` | `string` | ID of a specific `RecommendedAction` to simulate. If omitted, the Planner selects automatically. |

### Response `201 Created`

```json
{
  "success": true,
  "data": {
    "jobId": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b"
  }
}
```

The analysis workflow starts **immediately** in the background. Use the returned `jobId` to poll status or subscribe via WebSocket.

### Examples

#### Text-only analysis

```bash
curl -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "content=Q3 revenue dropped 12% due to churn in the enterprise segment." \
  -F "title=Q3 Revenue Analysis"
```

#### File upload (PDF)

```bash
curl -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "file=@/path/to/report.pdf" \
  -F "inputType=pdf" \
  -F "title=Board Report"
```

#### Mixed text + file

```bash
curl -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "content=Additional context: focus on APAC region." \
  -F "file=@/path/to/dashboard.png" \
  -F "inputType=mixed"
```

#### With simulation preference

```bash
curl -X POST http://localhost:3000/api/analysis-jobs \
  -H "x-user-id: user-123" \
  -F "content=Support ticket volume increased 40% this month." \
  -F 'simulationSettings={"preferredActionId":"action-001"}'
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

Returns the current status and progress of an analysis job.

### Request

```
GET /api/analysis-jobs/3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b
x-user-id: user-123
```

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b",
    "status": "processing",
    "currentStep": "insight_extraction",
    "progress": 30,
    "inputType": "text",
    "title": "Q3 Revenue Analysis",
    "error": null,
    "createdAt": "2026-05-16T14:00:00.000Z",
    "updatedAt": "2026-05-16T14:00:08.123Z"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique job identifier (UUID) |
| `status` | `string` | See [Job Status Values](#job-status-values) |
| `currentStep` | `string \| null` | The workflow step currently executing |
| `progress` | `number` | Overall progress percentage `0–100` |
| `inputType` | `string` | Detected or specified input type |
| `title` | `string \| null` | Optional job title |
| `error` | `string \| null` | Error message if `status = "failed"` |
| `createdAt` | `string` | ISO 8601 creation timestamp |
| `updatedAt` | `string` | ISO 8601 last update timestamp |

#### Job Status Values

| Status | Description |
|---|---|
| `queued` | Job created, workflow not yet started |
| `processing` | LangGraph workflow is actively running |
| `completed` | All steps finished successfully |
| `failed` | Workflow terminated with an error |
| `waiting_for_user` | Workflow paused, awaiting user clarification |

#### Workflow Step Values

| Step | Description | Progress % |
|---|---|---|
| `content_understanding` | Classifying and contextualizing input | ~15% |
| `insight_extraction` | Extracting facts, risks, and opportunities | ~30% |
| `implication_analysis` | Mapping business impacts of insights | ~50% |
| `action_recommendation` | Generating specific recommended actions | ~70% |
| `action_simulation` | Simulating execution of the selected action | ~85% |
| `outcome_generation` | Producing final outcome and executive summary | ~100% |

### Error Responses

| Status | Code | Cause |
|---|---|---|
| `401` | `UNAUTHORIZED` | Missing `x-user-id` header |
| `404` | `NOT_FOUND` | No job found with that `jobId` |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

---

## GET /api/analysis-jobs/:jobId/result

Returns the full structured analysis result. Only meaningful when `status = "completed"`.

### Request

```
GET /api/analysis-jobs/3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b/result
x-user-id: user-123
```

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "jobId": "3f7a2c91-4b1e-4d8f-9e3a-1c2d3e4f5a6b",
    "contentUnderstanding": { ... },
    "insights": [ ... ],
    "implications": [ ... ],
    "recommendedActions": [ ... ],
    "simulation": { ... },
    "outcome": { ... },
    "updatedAt": "2026-05-16T14:01:45.000Z"
  }
}
```

All nested objects are documented in [Data Models](./data-models.md).

> **Note:** Fields are populated progressively as the workflow runs. A result document may exist with only `contentUnderstanding` populated if the job is still processing. The full result is available when `status = "completed"`.

### Error Responses

| Status | Code | Cause |
|---|---|---|
| `401` | `UNAUTHORIZED` | Missing `x-user-id` header |
| `404` | `NOT_FOUND` | No result found for this `jobId` |
| `500` | `INTERNAL_ERROR` | Unexpected server error |
