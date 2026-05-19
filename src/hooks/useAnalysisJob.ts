import { useCallback, useEffect, useRef, useState } from 'react';
import { getAnalysisJob } from '../services/analysisApi';
import { AnalysisWebSocketClient } from '../services/analysisWebSocket';
import type {
  AnalysisJob,
  AwaitingApprovalPayload,
  ContentAnalyzedPayload,
  ContentNormalizedPayload,
  JobStartedPayload,
  NodeStartedPayload,
  WorkflowCompletedPayload,
  WorkflowFailedPayload,
  WsMessage,
} from '../types/analysis';

const NODE_INDEX_MAP: Record<string, number> = {
  IngestInputNode: 0,
  NormalizeContentNode: 1,
  ContentToActionNode: 2,
};

const NODE_PROGRESS_MAP: Record<string, number> = {
  IngestInputNode: 10,
  NormalizeContentNode: 20,
  ContentToActionNode: 60,
};

const COMPLETED_STEP_MESSAGES = [
  'Content validated and accepted',
  'Content cleaned and normalized',
  'Insights, implications, and actions generated',
];

const ACTIVE_STEP_MESSAGES = [
  'Validating and detecting input type',
  'Cleaning and preparing the source',
  'Calling AI model and generating recommendations',
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
          markStepCompleted(1);
          setProgress(20);
          activateNode('ContentToActionNode');
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
          markAllCompleted();
          if (payload.actionCount >= 0) {
            setErrorMessage(null);
          }
          break;
        }

        case 'awaiting_approval': {
          const payload = msg.payload as AwaitingApprovalPayload;
          markAllCompleted();
          setClarificationQuestion(
            `${payload.pendingApprovals.length} action(s) need approval.`,
          );
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
    [activateNode, inferFailedStepIndex, markAllCompleted, markStepCompleted, markStepFailed, summarizeWorkflowError],
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

  useEffect(() => {
    if (!jobId) {
      resetState();
      return;
    }

    let isMounted = true;
    let pollTimer: ReturnType<typeof setInterval> | undefined;
    resetState();

    const loadJobSnapshot = () => {
      getAnalysisJob(jobId)
        .then(job => {
          if (isMounted) {
            applyJobSnapshot(job);
            if (TERMINAL_JOB_STATUSES.includes(job.status)) {
              if (pollTimer) {
                clearInterval(pollTimer);
              }
            }
          }
        })
        .catch(error => {
          if (isMounted) {
            setErrorMessage(
              error instanceof Error ? error.message : 'Could not load job.',
            );
          }
        });
    };

    loadJobSnapshot();
    pollTimer = setInterval(loadJobSnapshot, JOB_POLL_INTERVAL_MS);

    const client = clientRef.current;
    client.connect(
      jobId,
      handleMessage,
      undefined,
      handleTerminalMessage,
    );

    return () => {
      isMounted = false;
      if (pollTimer) {
        clearInterval(pollTimer);
      }
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
