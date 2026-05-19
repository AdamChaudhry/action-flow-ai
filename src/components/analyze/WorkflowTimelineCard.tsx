import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Circle as CircleIcon,
  GitBranch,
} from 'lucide-react-native';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';
import type { StepStatus, WorkflowStep } from '../../hooks/useAnalysisJob';

interface WorkflowTimelineCardProps {
  steps: WorkflowStep[];
  activeStepLabel: string;
  isCompleted: boolean;
  isError: boolean;
}

const PENDING_ICONS = [CircleIcon, BarChart2, GitBranch];

const StepIcon: React.FC<{ status: StepStatus; index: number }> = ({
  status,
  index,
}) => {
  if (status === 'completed') {
    return <CheckCircle2 size={20} color={colors.aiBlue} fill={colors.aiBlue} />;
  }

  if (status === 'active') {
    return <ActivityIndicator size="small" color={colors.aiBlue} />;
  }

  const Icon = PENDING_ICONS[index % PENDING_ICONS.length];
  return <Icon size={20} color={colors.textTertiary} />;
};

const WorkflowStepRow: React.FC<{
  step: WorkflowStep;
  index: number;
  totalSteps: number;
}> = ({ step, index, totalSteps }) => {
  const isActive = step.status === 'active';
  const isPending = step.status === 'pending';

  return (
    <View style={rowStyles.container}>
      <View style={rowStyles.iconColumn}>
        <StepIcon status={step.status} index={index} />
        {index < totalSteps - 1 && (
          <View
            style={[
              rowStyles.connector,
              step.status === 'completed' && rowStyles.connectorCompleted,
            ]}
          />
        )}
      </View>

      <View style={rowStyles.content}>
        <View style={rowStyles.labelRow}>
          <Typography
            variant="labelMd"
            color={
              isPending
                ? colors.textTertiary
                : isActive
                ? colors.aiBlue
                : colors.textPrimary
            }
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
          <Typography variant="labelSm" color={colors.textTertiary}>
            {step.subLabel}
          </Typography>
        )}
      </View>
    </View>
  );
};

export const WorkflowTimelineCard: React.FC<WorkflowTimelineCardProps> = ({
  steps,
  activeStepLabel,
  isCompleted,
  isError,
}) => (
  <Card style={styles.card} variant="elevated">
    <View style={styles.header}>
      <Typography variant="labelSm" color={colors.textSecondary} style={styles.label}>
        WORKFLOW TIMELINE
      </Typography>

      {isError ? (
        <Badge
          label="Failed"
          variant="neutral"
          icon={<AlertCircle size={10} color={colors.textSecondary} />}
        />
      ) : isCompleted ? (
        <Badge
          label="Completed"
          variant="success"
          icon={<CheckCircle2 size={10} color={colors.aiBlue} />}
        />
      ) : (
        <Badge
          label={activeStepLabel}
          variant="ai"
          icon={<ActivityIndicator size="small" color={colors.aiBlue} />}
        />
      )}
    </View>

    <View>
      {steps.map((step, index) => (
        <WorkflowStepRow
          key={step.id}
          step={step}
          index={index}
          totalSteps={steps.length}
        />
      ))}
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.stackSm,
    marginBottom: spacing.stackLg,
  },
  label: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.stackMd,
    marginBottom: 4,
  },
  iconColumn: {
    alignItems: 'center',
    width: 20,
  },
  connector: {
    width: 1,
    flex: 1,
    minHeight: 24,
    marginTop: 4,
    backgroundColor: colors.border,
  },
  connectorCompleted: {
    backgroundColor: colors.aiBlue,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.stackMd,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  progressBar: {
    height: 3,
    marginTop: spacing.stackSm,
    overflow: 'hidden',
    backgroundColor: colors.border,
    borderRadius: rounded.full,
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: colors.aiBlue,
    borderRadius: rounded.full,
  },
});
