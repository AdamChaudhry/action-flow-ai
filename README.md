# Mobile App Overview

## What This Mobile App Does

This mobile app turns business content into an interactive decision support experience. Users can submit text, documents, or images, then the app guides them through:

- content analysis,
- insight discovery,
- implication review,
- recommended actions,
- action simulation.

The app is built as a React Native experience with a mobile-first workflow and real-time feedback on analysis progress.

---

## Business Domain

The product sits between business signals and decision-making on mobile.

Typical input sources:

- support summaries,
- customer feedback,
- screenshots or images,
- reports and notes,
- operational or finance observations.

Typical output goals:

- "What is happening?"
- "Why does this matter?"
- "What should we do next?"
- "What will happen if we try this?"

The business rule is clear: mobile recommendations are advisory. Actions are surfaced for human review and must be validated before any real-world execution.

---

## Core Domain Vocabulary

| Term | Meaning |
|---|---|
| Analysis Job | A submitted request for content analysis tied to a user session |
| Input Type | Content accepted from text, document, image, or mixed input |
| Baseline State | Initial snapshot of the submitted content and context |
| Insight | A key finding, trend, or signal identified from the content |
| Implication | The business impact associated with one or more insights |
| Recommended Action | A suggested next step visible to the user |
| Pending Approval | Suggested actions remain reviewable in the mobile flow |
| Simulation | A projected result for a chosen action |
| Outcome State | The summary returned after a simulation completes |

---

## Main User Journey

1. User opens the app and starts analysis from the home header.
2. User provides content via text entry, document upload, or image selection.
3. The app creates an analysis job and tracks progress.
4. When analysis completes, the app shows insights and the next logical implications.
5. The user reviews recommended actions under the same job context.
6. The user selects an action and runs a simulation.
7. The app returns a simulation result for review before real-world follow-up.

---

## System Architecture

```text
App.tsx
  ├─ Header (start analysis)
  ├─ MainTabNavigator
  │   ├─ Analyze flow
  │   │   ├─ AnalyzeScreen
  │   │   ├─ InsightsScreen
  │   │   └─ ImplicationsScreen
  │   └─ Actions flow
  │       ├─ ActionsScreen
  │       └─ SimulationScreen
  ├─ shared hooks and services
  └─ UI components
```

The app is organized into:

- navigation flows for analysis and actions,
- screens for each stage of the workflow,
- hooks for business logic,
- components for reusable UI patterns.

---

## Runtime Components

| Screens | Responsibility |
|---|---|
| `Analyze Screen` | Collects input and submits analysis jobs |
| `Insights Screen` | Displays generated insights |
| `Implication sScreen` | Shows business implications |
| `Actions Screen` | Lists recommended actions and starts simulations |
| `Simulation Screen` | Presents action simulation results |

---

## Key Technical Principles

- Keep `jobId` as the central workflow correlation key.
- Keep UI screens focused on display and navigation.
- Keep business logic in hooks and service modules.
- Keep the mobile flow lightweight and responsive.
- Treat analysis output as advisory, not automatic execution.

---

## Antigravity Rules and Skills

This project uses Antigravity guidance to keep the mobile app aligned with architecture and domain boundaries.

- `rules/` define broad, always-on constraints such as clean layer separation, navigation patterns, and code quality expectations.
- `skills/` capture role-specific workflows for mobile development, feature implementation, and API interaction.
- Mobile work should follow the rules by keeping UI focused on navigation and display, while moving business logic into hooks and services.
- Skills are used when adding new screens, business flows, or integrations to ensure consistent app patterns.

### Mobile Rule Summary

| Rule | Purpose |
|---|---|
| `api-integration-doc.md` | Documents the backend REST contract and how mobile should call the analysis API. |
| `code-quality.md` | Enforces maintainable TypeScript, clear naming, and small, testable units. |
| `data-models.md` | Defines the contract for request/response types and shared analysis data structures. |
| `design.md` | Captures the mobile visual and interaction style expected for UI consistency. |
| `mobile-rules.md` | Restricts mobile components to presentation, navigation, hooks, and API client usage only. |
| `web-socket.md` | Describes WebSocket events and payloads for real-time job progress updates. |
| `workflow.md` | Documents the two main analysis/execution workflows and their node responsibilities. |

### Mobile Skill Summary

| Skill | Purpose |
|---|---|
| `react-native-mobile-developer.md` | Guides implementation of production-grade React Native features, performance, and mobile UX. |

