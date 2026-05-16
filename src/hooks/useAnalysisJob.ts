import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisWebSocketClient } from '../services/analysisWebSocket';
import type { WsMessage, StepStartedPayload, AnalysisFailedPayload } from '../types/analysis';

// ─── Step mapping ─────────────────────────────────────────────────────────────
// Maps WS step names → display step index (0-based)

const STEP_INDEX_MAP: Record<string, number> = {
  // LangGraph step names
  content_understanding: 0,
  extract_insights: 1,
  insight_extraction: 1,
  analyze_implications: 2,
  implication_analysis: 2,
  recommend_actions: 3,
  action_recommendation: 3,
  select_action: 3,
  simulate_action: 4,
  action_simulation: 4,
  generate_outcome: 5,
  outcome_generation: 5,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type StepStatus = 'completed' | 'active' | 'pending';

export interface WorkflowStep {
  id: string;
  label: string;
  subLabel: string;
  status: StepStatus;
}

type JobState = 'processing' | 'completed' | 'failed' | 'clarification_needed';

// ─── Initial steps ─────────────────────────────────────────────────────────────

const INITIAL_STEPS: WorkflowStep[] = [
  { id: '1', label: 'Reading content',               subLabel: 'Classifying and contextualizing', status: 'pending' },
  { id: '2', label: 'Extracting key insights',        subLabel: 'Facts, risks, opportunities',      status: 'pending' },
  { id: '3', label: 'Analyzing implications',         subLabel: 'Mapping business impact',          status: 'pending' },
  { id: '4', label: 'Generating recommended actions', subLabel: 'Specific, executable actions',     status: 'pending' },
  { id: '5', label: 'Simulating action execution',    subLabel: 'Before & after scenario',          status: 'pending' },
  { id: '6', label: 'Producing final outcome',        subLabel: 'Executive summary & confidence',   status: 'pending' },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseAnalysisJobResult {
  steps: WorkflowStep[];
  progress: number;
  jobState: JobState;
  errorMessage: string | null;
  clarificationQuestion: string | null;
  activeStepLabel: string;
}

export function useAnalysisJob(jobId: string | undefined): UseAnalysisJobResult {
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [progress, setProgress] = useState(0);
  const [jobState, setJobState] = useState<JobState>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);

  const clientRef = useRef(new AnalysisWebSocketClient());

  const markStepActive = useCallback((stepIndex: number) => {
    setSteps(prev =>
      prev.map((s, i) => {
        if (i < stepIndex)  { return { ...s, status: 'completed' }; }
        if (i === stepIndex) { return { ...s, status: 'active' }; }
        return { ...s, status: 'pending' };
      }),
    );
  }, []);

  const markStepCompleted = useCallback((stepIndex: number) => {
    setSteps(prev =>
      prev.map((s, i) => (i <= stepIndex ? { ...s, status: 'completed' } : s)),
    );
  }, []);

  const markAllCompleted = useCallback(() => {
    setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    setProgress(100);
    setJobState('completed');
  }, []);

  const handleMessage = useCallback(
    (msg: WsMessage) => {
      switch (msg.type) {
        case 'step_started': {
          const { step } = msg.payload as StepStartedPayload;
          const idx = STEP_INDEX_MAP[step];
          if (idx !== undefined) {
            markStepActive(idx);
            // Approximate progress based on step index
            setProgress(Math.round(((idx) / INITIAL_STEPS.length) * 90));
          }
          break;
        }

        case 'step_completed': {
          const { step } = msg.payload as StepStartedPayload;
          const idx = STEP_INDEX_MAP[step];
          if (idx !== undefined) {
            markStepCompleted(idx);
          }
          break;
        }

        case 'analysis_progress': {
          const p = (msg.payload as { progress?: number }).progress;
          if (typeof p === 'number') {
            setProgress(p);
          }
          break;
        }

        case 'analysis_completed': {
          markAllCompleted();
          break;
        }

        case 'analysis_failed': {
          const { error } = msg.payload as AnalysisFailedPayload;
          setErrorMessage(error?.message ?? 'Analysis failed.');
          setJobState('failed');
          break;
        }

        case 'analysis_needs_clarification': {
          const { question } = msg.payload as { question: string };
          setClarificationQuestion(question);
          setJobState('clarification_needed');
          break;
        }

        default:
          break;
      }
    },
    [markStepActive, markStepCompleted, markAllCompleted],
  );

  useEffect(() => {
    if (!jobId) { return; }

    const client = clientRef.current;
    client.connect(jobId, handleMessage);

    return () => {
      client.disconnect();
    };
  }, [jobId, handleMessage]);

  const activeStep = steps.find(s => s.status === 'active');

  return {
    steps,
    progress,
    jobState,
    errorMessage,
    clarificationQuestion,
    activeStepLabel: activeStep?.label ?? 'Processing…',
  };
}
