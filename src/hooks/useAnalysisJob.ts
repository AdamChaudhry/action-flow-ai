import { useCallback, useEffect, useRef, useState } from 'react';
import { getAnalysisJob } from '../services/analysisApi';
import { AnalysisWebSocketClient } from '../services/analysisWebSocket';
import type {
  ActionSimulatedPayload,
  AnalysisJob,
  AwaitingApprovalPayload,
  ContentAnalyzedPayload,
  ContentNormalizedPayload,
  JobStartedPayload,
  NodeStartedPayload,
  OutcomeUpdatedPayload,
  WorkflowCompletedPayload,
  WorkflowFailedPayload,
  WsMessage,
} from '../types/analysis';

const NODE_INDEX_MAP: Record<string, number> = {
  IngestInputNode: 0,
  NormalizeContentNode: 1,
  ContentToActionNode: 2,
  EvaluationNode: 3,
};

const NODE_PROGRESS_MAP: Record<string, number> = {
  IngestInputNode: 10,
  NormalizeContentNode: 20,
  ContentToActionNode: 60,
  EvaluationNode: 80,
};

const COMPLETED_STEP_MESSAGES = [
  'Content validated and accepted',
  'Content cleaned and normalized',
  'Insights, implications, and actions generated',
  'Top action auto-simulated',
];

const ACTIVE_STEP_MESSAGES = [
  'Validating and detecting input type',
  'Cleaning and preparing the source',
  'Calling AI model and generating recommendations',
  'Running auto-simulation on the highest-priority action',
];

export type StepStatus = 'completed' | 'active' | 'pending' | 'failed';

export interface WorkflowStep {
  id: string;
  label: string;
  subLabel: string;
  status: StepStatus;
}

type JobState = 'processing' | 'completed' | 'failed';
type TerminalStatus = 'success' | 'failed';
const JOB_POLL_INTERVAL_MS = 2500;
const TERMINAL_JOB_STATUSES = ['completed', 'waiting_for_user', 'failed'];

const INITIAL_STEPS: WorkflowStep[] = [
  {
    id: 'ingest',
    label: 'Reading content',
    subLabel: 'Validating and detecting input type',
    status: 'pending',
  },
  {
    id: 'normalize',
    label: 'Normalizing content',
    subLabel: 'Cleaning and preparing the source',
    status: 'pending',
  },
  {
    id: 'analyze',
    label: 'Extracting insights and actions',
    subLabel: 'Insights, implications, recommendations',
    status: 'pending',
  },
  {
    id: 'simulate',
    label: 'Auto-simulating top action',
    subLabel: 'Running simulation on the highest-priority action',
    status: 'pending',
  },
];

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
  const [clarificationQuestion, setClarificationQuestion] = useState<
    string | null
  >(null);

  const clientRef = useRef(new AnalysisWebSocketClient());
  const isTerminalRef = useRef(false);

  const resetState = useCallback(() => {
    isTerminalRef.current = false;
    setSteps(INITIAL_STEPS);
    setProgress(0);
    setJobState('processing');
    setErrorMessage(null);
    setClarificationQuestion(null);
  }, []);

  const markStepActive = useCallback((stepIndex: number) => {
    setSteps(prev =>
      prev.map((step, index) => {
        if (index < stepIndex) {
          return {
            ...step,
            status: 'completed',
            subLabel: COMPLETED_STEP_MESSAGES[index] ?? step.subLabel,
          };
        }
        if (index === stepIndex) {
          return {
            ...step,
            status: 'active',
            subLabel: ACTIVE_STEP_MESSAGES[index] ?? step.subLabel,
          };
        }
        return { ...step, status: 'pending' };
      }),
    );
  }, []);

  const markStepCompleted = useCallback((stepIndex: number) => {
    setSteps(prev =>
      prev.map((step, index) => {
        if (index > stepIndex) {
          return step;
        }

        return {
          ...step,
          status: 'completed',
          subLabel: COMPLETED_STEP_MESSAGES[index] ?? step.subLabel,
        };
      }),
    );
  }, []);

  const summarizeWorkflowError = useCallback((message?: string | null) => {
    if (!message) {
      return 'This step failed. Please try again.';
    }

    const lower = message.toLowerCase();

    if (lower.includes('429') || lower.includes('too many requests') || lower.includes('quota')) {
      return 'AI quota limit reached. Check Gemini billing or try again later.';
    }

    if (lower.includes('rawinput') || lower.includes('validation')) {
      return 'Input validation failed. Check the content and try again.';
    }

    if (lower.includes('network') || lower.includes('fetch')) {
      return 'Network request failed. Check the API connection and try again.';
    }

    if (lower.includes('json') || lower.includes('parse')) {
      return 'AI response could not be parsed. Please retry the analysis.';
    }

    return message.length > 120 ? `${message.slice(0, 117).trim()}...` : message;
  }, []);

  const inferFailedStepIndex = useCallback((message?: string | null) => {
    const lower = message?.toLowerCase() ?? '';

    if (
      lower.includes('gemini') ||
      lower.includes('googlegenerativeai') ||
      lower.includes('generatecontent') ||
      lower.includes('quota') ||
      lower.includes('too many requests') ||
      lower.includes('llm') ||
      lower.includes('contenttoaction')
    ) {
      return NODE_INDEX_MAP.ContentToActionNode;
    }

    if (lower.includes('normalize')) {
      return NODE_INDEX_MAP.NormalizeContentNode;
    }

    if (lower.includes('rawinput') || lower.includes('validation') || lower.includes('ingest')) {
      return NODE_INDEX_MAP.IngestInputNode;
    }

    return undefined;
  }, []);

  const markStepFailed = useCallback((stepIndex?: number, message?: string) => {
    setSteps(prev => {
      const activeIndex = prev.findIndex(step => step.status === 'active');
      const lastCompletedIndex = prev.reduce(
        (latestIndex, step, index) => step.status === 'completed' ? index : latestIndex,
        -1,
      );
      const fallbackIndex = activeIndex >= 0 ? activeIndex : Math.min(lastCompletedIndex + 1, prev.length - 1);
      const failedIndex = stepIndex ?? fallbackIndex;
      const shortMessage = summarizeWorkflowError(message);

      return prev.map((step, index) => {
        if (index < failedIndex) {
          return {
            ...step,
            status: 'completed',
            subLabel: COMPLETED_STEP_MESSAGES[index] ?? step.subLabel,
          };
        }

        if (index === failedIndex) {
          return {
            ...step,
            status: 'failed',
            subLabel: shortMessage,
          };
        }

        return { ...step, status: 'pending' };
      });
    });
  }, [summarizeWorkflowError]);

  const markAllCompleted = useCallback(() => {
    isTerminalRef.current = true;
    setSteps(prev =>
      prev.map((step, index) => ({
        ...step,
        status: 'completed',
        subLabel: COMPLETED_STEP_MESSAGES[index] ?? step.subLabel,
      })),
    );
    setProgress(100);
    setJobState('completed');
  }, []);

  const applyJobSnapshot = useCallback(
    (job: AnalysisJob) => {
      if (isTerminalRef.current && !TERMINAL_JOB_STATUSES.includes(job.status)) {
        return;
      }

      setProgress(job.progress);
      setErrorMessage(job.error);
      setClarificationQuestion(job.clarificationQuestion);

      if (job.status === 'completed') {
        markAllCompleted();
        return;
      }

      if (job.status === 'waiting_for_user') {
        markAllCompleted();
        return;
      }

      if (job.status === 'failed') {
        isTerminalRef.current = true;
        const shortMessage = summarizeWorkflowError(job.error);
        markStepFailed(
          inferFailedStepIndex(job.error) ?? (job.currentNode ? NODE_INDEX_MAP[job.currentNode] : undefined),
          shortMessage,
        );
        setErrorMessage(shortMessage);
        setJobState('failed');
        return;
      }

      setJobState('processing');

      if (job.currentNode) {
        const index = NODE_INDEX_MAP[job.currentNode];
        if (index !== undefined) {
          markStepActive(index);
        }
      }
    },
    [inferFailedStepIndex, markAllCompleted, markStepActive, markStepFailed, summarizeWorkflowError],
  );

  const activateNode = useCallback(
    (node: string) => {
      const index = NODE_INDEX_MAP[node];
      if (index === undefined) {
        return;
      }

      markStepActive(index);
      setProgress(prev => NODE_PROGRESS_MAP[node] ?? prev);
    },
    [markStepActive],
  );

  const handleMessage = useCallback(
    (msg: WsMessage) => {
      switch (msg.type) {
        case 'job_started': {
          const payload = msg.payload as JobStartedPayload;
          setJobState('processing');
          activateNode('IngestInputNode');
          if (payload.inputSource) {
            setClarificationQuestion(null);
          }
          break;
        }

        case 'content_normalized': {
          const payload = msg.payload as ContentNormalizedPayload;
          // Steps 0 (IngestInput) and 1 (NormalizeContent) are done.
          // Step 2 (ContentToActionNode) will be activated by the
          // node_started event that fires immediately after.
          markStepCompleted(1);
          setProgress(20);
          if (payload.normalizedLength > 0) {
            setErrorMessage(null);
          }
          break;
        }

        case 'node_started': {
          const { node } = msg.payload as NodeStartedPayload;
          activateNode(node);
          break;
        }

        case 'content_analyzed': {
          const payload = msg.payload as ContentAnalyzedPayload;
          // Step 3 (ContentToActionNode) is done — do NOT mark all completed yet.
          // awaiting_approval → action_simulated → outcome_updated still need to fire.
          markStepCompleted(2);
          setProgress(60);
          if (payload.actionCount >= 0) {
            setErrorMessage(null);
          }
          break;
        }

        case 'awaiting_approval': {
          const payload = msg.payload as AwaitingApprovalPayload;
          // Workflow 1 is done but WS stays open — auto-simulation follows immediately.
          // Mark the first 3 steps complete and activate the 4th (simulation) step.
          markStepCompleted(2);
          markStepActive(3);
          setProgress(80);
          setClarificationQuestion(
            `${payload.pendingApprovals.length} action(s) ready — running auto-simulation…`,
          );
          break;
        }

        case 'action_simulated': {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _payload = msg.payload as ActionSimulatedPayload;
          // The highest-priority action has been simulated.
          // Keep the 4th step active while we wait for outcome_updated.
          setProgress(90);
          break;
        }

        case 'outcome_updated': {
          const ouPayload = msg.payload as OutcomeUpdatedPayload;
          // Outcome is rebuilt — this is the true terminal event of the full flow.
          markAllCompleted();
          setClarificationQuestion(ouPayload.outcome.summary);
          break;
        }

        case 'workflow_completed': {
          const payload = msg.payload as WorkflowCompletedPayload;
          markAllCompleted();
          setClarificationQuestion(payload.outcome.summary);
          break;
        }

        case 'workflow_failed': {
          const { error } = msg.payload as WorkflowFailedPayload;
          isTerminalRef.current = true;
          const shortMessage = summarizeWorkflowError(error?.message);
          setErrorMessage(shortMessage);
          markStepFailed(inferFailedStepIndex(error?.message), shortMessage);
          setJobState('failed');
          break;
        }

        default:
          break;
      }
    },
    [activateNode, inferFailedStepIndex, markAllCompleted, markStepActive, markStepCompleted, markStepFailed, summarizeWorkflowError],
  );

  const handleTerminalMessage = useCallback(
    (msg: WsMessage, status: TerminalStatus) => {
      if (status === 'success') {
        markAllCompleted();
        return;
      }

      const payload = msg.payload as Partial<WorkflowFailedPayload>;
      isTerminalRef.current = true;
      const shortMessage = summarizeWorkflowError(payload.error?.message);
      setErrorMessage(shortMessage);
      markStepFailed(inferFailedStepIndex(payload.error?.message), shortMessage);
      setJobState('failed');
    },
    [inferFailedStepIndex, markAllCompleted, markStepFailed, summarizeWorkflowError],
  );

  const wsConnectedRef = useRef(false);

  useEffect(() => {
    if (!jobId) {
      resetState();
      return;
    }

    let isMounted = true;
    let pollTimer: ReturnType<typeof setInterval> | undefined;
    wsConnectedRef.current = false;
    resetState();

    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = undefined;
      }
    };

    const loadJobSnapshot = () => {
      // Skip poll cycle if WS is handling events.
      if (wsConnectedRef.current) {
        stopPolling();
        return;
      }

      getAnalysisJob(jobId)
        .then(job => {
          if (!isMounted) { return; }
          applyJobSnapshot(job);
          if (TERMINAL_JOB_STATUSES.includes(job.status)) {
            stopPolling();
          }
        })
        .catch(err => {
          if (isMounted) {
            setErrorMessage(
              err instanceof Error ? err.message : 'Could not load job.',
            );
          }
        });
    };

    // One immediate fetch so the UI has data before WS connects.
    loadJobSnapshot();

    // Start polling as a fallback — cancelled as soon as WS connects.
    pollTimer = setInterval(loadJobSnapshot, JOB_POLL_INTERVAL_MS);

    const client = clientRef.current;
    client.connect(
      jobId,
      handleMessage,
      // onOpen: WS is live — stop the poll loop immediately.
      () => {
        wsConnectedRef.current = true;
        stopPolling();
      },
      handleTerminalMessage,
    );

    return () => {
      isMounted = false;
      stopPolling();
      wsConnectedRef.current = false;
      client.disconnect();
    };
  }, [applyJobSnapshot, handleMessage, handleTerminalMessage, jobId, resetState]);


  const activeStep = steps.find(step => step.status === 'active');

  return {
    steps,
    progress,
    jobState,
    errorMessage,
    clarificationQuestion,
    activeStepLabel: activeStep?.label ?? 'Processing...',
  };
}
