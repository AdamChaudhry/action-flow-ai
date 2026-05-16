import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import {
  CheckCircle2,
  RefreshCw,
  Circle as CircleIcon,
  BarChart2,
  GitBranch,
  Layers,
  Cpu,
  Zap,
  AlertCircle,
  HelpCircle,
} from 'lucide-react-native';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { colors } from '../theme/colors';
import { spacing, rounded } from '../theme/spacing';
import { useAnalysisJob, WorkflowStep, StepStatus } from '../hooks/useAnalysisJob';

// ─── Navigation types ────────────────────────────────────────────────────────

type ProcessingRouteParams = {
  Processing: { jobId?: string };
};

// ─── Circular Progress ────────────────────────────────────────────────────────

const CircularProgress: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 56,
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
      <Circle
        cx={center} cy={center} r={radius}
        stroke={colors.aiBlue} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
        strokeLinecap="round" rotation="-90" origin={`${center}, ${center}`}
      />
    </Svg>
  );
};

// ─── Step Icon ────────────────────────────────────────────────────────────────

const PENDING_ICONS = [CircleIcon, BarChart2, GitBranch, Layers, Cpu, CircleIcon];

const StepIcon: React.FC<{ status: StepStatus; index: number }> = ({ status, index }) => {
  if (status === 'completed') {
    return <CheckCircle2 size={20} color={colors.aiBlue} fill={colors.aiBlue} />;
  }
  if (status === 'active') {
    return <RefreshCw size={20} color={colors.aiBlue} />;
  }
  const Icon = PENDING_ICONS[index % PENDING_ICONS.length];
  return <Icon size={20} color={colors.textTertiary} />;
};

// ─── Workflow Step Row ─────────────────────────────────────────────────────────

const TOTAL_STEPS = 6;

const WorkflowStepRow: React.FC<{ step: WorkflowStep; index: number }> = ({ step, index }) => {
  const isActive  = step.status === 'active';
  const isPending = step.status === 'pending';

  return (
    <View style={rowStyles.container}>
      <View style={rowStyles.iconColumn}>
        <StepIcon status={step.status} index={index} />
        {index < TOTAL_STEPS - 1 && (
          <View style={[
            rowStyles.connector,
            step.status === 'completed' && rowStyles.connectorCompleted,
          ]} />
        )}
      </View>
      <View style={rowStyles.content}>
        <View style={rowStyles.labelRow}>
          <Typography
            variant="labelMd"
            color={isPending ? colors.textTertiary : isActive ? colors.aiBlue : colors.textPrimary}
          >
            {step.label}
          </Typography>
          {isActive && <Badge label="ACTIVE" variant="ai" style={rowStyles.badge} />}
        </View>
        {isActive && (
          <View style={rowStyles.progressBar}>
            <View style={rowStyles.progressFill} />
          </View>
        )}
        {!isActive && step.subLabel !== '' && (
          <Typography variant="labelSm" color={colors.textTertiary}>{step.subLabel}</Typography>
        )}
      </View>
    </View>
  );
};

const rowStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: spacing.stackMd, marginBottom: 4 },
  iconColumn: { alignItems: 'center', width: 20 },
  connector: { width: 1, flex: 1, minHeight: 24, backgroundColor: colors.border, marginTop: 4 },
  connectorCompleted: { backgroundColor: colors.aiBlue },
  content: { flex: 1, paddingBottom: spacing.stackMd },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, flexWrap: 'wrap' },
  badge: { paddingVertical: 2, paddingHorizontal: 6 },
  progressBar: { height: 3, backgroundColor: colors.border, borderRadius: rounded.full, marginTop: spacing.stackSm, overflow: 'hidden' },
  progressFill: { width: '60%', height: '100%', backgroundColor: colors.aiBlue, borderRadius: rounded.full },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const ProcessingScreen: React.FC = () => {
  const route = useRoute<RouteProp<ProcessingRouteParams, 'Processing'>>();
  const jobId = route.params?.jobId;

  const { steps, progress, jobState, errorMessage, clarificationQuestion, activeStepLabel } =
    useAnalysisJob(jobId);

  // Show clarification alert when the server needs more info
  React.useEffect(() => {
    if (jobState === 'clarification_needed' && clarificationQuestion) {
      Alert.alert('Clarification Needed', clarificationQuestion);
    }
  }, [jobState, clarificationQuestion]);

  const isError     = jobState === 'failed';
  const isCompleted = jobState === 'completed';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <View style={styles.heroSection}>
        <Typography variant="headlineLg" align="center" style={styles.heroTitle}>
          {isCompleted ? 'Analysis Complete' : isError ? 'Analysis Failed' : 'Synthesizing\nIntelligence'}
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary} align="center" style={styles.heroSubtitle}>
          {isCompleted
            ? 'All steps completed successfully. Your insights are ready.'
            : isError
            ? errorMessage ?? 'An unexpected error occurred.'
            : 'ActionFlow AI is processing your request using advanced semantic mapping and predictive logic.'}
        </Typography>
        {!jobId && (
          <Badge label="Demo Mode — no job ID" variant="neutral" style={styles.demoBadge} />
        )}
      </View>

      {/* ── Workflow Timeline ─────────────────────────────────────────────── */}
      <Card style={styles.card} variant="elevated">
        <View style={styles.timelineHeader}>
          <Typography variant="labelSm" color={colors.textSecondary} style={styles.timelineLabel}>
            WORKFLOW TIMELINE
          </Typography>
          {isError ? (
            <Badge label="Failed" variant="neutral" icon={<AlertCircle size={10} color={colors.textSecondary} />} />
          ) : isCompleted ? (
            <Badge label="Completed" variant="success" icon={<CheckCircle2 size={10} color={colors.aiBlue} />} />
          ) : (
            <Badge
              label={activeStepLabel}
              variant="ai"
              icon={<View style={styles.liveDot} />}
            />
          )}
        </View>
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <WorkflowStepRow key={step.id} step={step} index={index} />
          ))}
        </View>
      </Card>

      {/* ── Preliminary Signal (shown once analysis has started) ──────────── */}
      {!isError && (
        <View style={[styles.signalCard, isCompleted && styles.signalCardCompleted]}>
          <View style={styles.signalDecorativeCircle} />
          <View style={styles.signalHeaderRow}>
            {isCompleted
              ? <CheckCircle2 size={14} color={colors.surface} />
              : <Zap size={14} color={colors.surface} />
            }
            <Typography variant="labelSm" color={colors.surface} style={styles.signalHeaderText}>
              {isCompleted ? 'ANALYSIS COMPLETE' : 'PRELIMINARY SIGNAL'}
            </Typography>
          </View>
          <Typography variant="bodyMd" color={colors.surface} style={styles.signalBody}>
            {isCompleted
              ? 'Your full results are now available. Navigate to the results screen to view insights, implications, and recommended actions.'
              : 'AI is actively mapping patterns in your content. Preliminary signals will appear here as they are detected.'}
          </Typography>
          {!isCompleted && (
            <View style={styles.confidenceBadge}>
              <HelpCircle size={10} color={colors.aiBlue} />
              <Typography variant="labelSm" color={colors.aiBlue}> Analyzing…</Typography>
            </View>
          )}
        </View>
      )}

      {/* ── Overall Progress ──────────────────────────────────────────────── */}
      <View style={styles.progressSection}>
        <View style={styles.progressTextBlock}>
          <Typography variant="bodySm" color={colors.textSecondary}>
            Overall Progress
          </Typography>
          <Typography variant="headlineLg">{progress}%</Typography>
        </View>
        <CircularProgress progress={progress} size={56} />
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: spacing.marginMobile, gap: spacing.stackLg },

  heroSection: { paddingVertical: spacing.stackMd, alignItems: 'center' },
  heroTitle: { letterSpacing: -0.5, marginBottom: spacing.stackMd },
  heroSubtitle: { maxWidth: 280 },
  demoBadge: { marginTop: spacing.stackMd },

  card: { padding: spacing.gutter },

  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackLg,
  },
  timelineLabel: { letterSpacing: 0.5, textTransform: 'uppercase' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.aiBlue },
  stepsContainer: { gap: 0 },

  signalCard: {
    backgroundColor: colors.aiBlue,
    borderRadius: rounded.lg,
    padding: spacing.gutter,
    overflow: 'hidden',
    position: 'relative',
  },
  signalCardCompleted: {
    backgroundColor: colors.success,
  },
  signalDecorativeCircle: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)', right: -40, bottom: -40,
  },
  signalHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.stackMd },
  signalHeaderText: { letterSpacing: 0.5, opacity: 0.85 },
  signalBody: { marginBottom: spacing.stackMd, lineHeight: 24 },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: rounded.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 4,
  },

  progressSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.stackMd, paddingHorizontal: spacing.stackSm,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  progressTextBlock: { gap: 2 },
});
