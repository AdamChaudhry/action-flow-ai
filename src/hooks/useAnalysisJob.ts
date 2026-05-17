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

export type StepStatus = 'completed' | 'active' | 'pending';

export interface WorkflowStep {
  id: string;
  label: string;
  subLabel: string;
  status: StepStatus;
}

type JobState = 'processing' | 'completed' | 'failed';

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

  const markStepActive = useCallback((stepIndex: number) => {
    setSteps(prev =>
      prev.map((step, index) => {
        if (index < stepIndex) {
          return { ...step, status: 'completed' };
        }
        if (index === stepIndex) {
          return { ...step, status: 'active' };
        }
        return { ...step, status: 'pending' };
      }),
    );
  }, []);

  const markStepCompleted = useCallback((stepIndex: number) => {
    setSteps(prev =>
      prev.map((step, index) =>
        index <= stepIndex ? { ...step, status: 'completed' } : step,
      ),
    );
  }, []);

  const markAllCompleted = useCallback(() => {
    setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
    setProgress(100);
    setJobState('completed');
  }, []);

  const applyJobSnapshot = useCallback(
    (job: AnalysisJob) => {
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
        setJobState('failed');
        return;
      }

      if (job.currentNode) {
        const index = NODE_INDEX_MAP[job.currentNode];
        if (index !== undefined) {
          markStepActive(index);
        }
      }
    },
    [markAllCompleted, markStepActive],
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
          markStepCompleted(2);
          setProgress(60);
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

        case 'workflow_failed': {
          const { error } = msg.payload as WorkflowFailedPayload;
          setErrorMessage(error?.message ?? 'Analysis failed.');
          setJobState('failed');
          break;
        }

        default:
          break;
      }
    },
    [activateNode, markAllCompleted, markStepCompleted],
  );

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let isMounted = true;

    getAnalysisJob(jobId)
      .then(job => {
        if (isMounted) {
          applyJobSnapshot(job);
        }
      })
      .catch(error => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Could not load job.',
          );
        }
      });

    const client = clientRef.current;
    client.connect(jobId, handleMessage);

    return () => {
      isMounted = false;
      client.disconnect();
    };
  }, [applyJobSnapshot, handleMessage, jobId]);

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
