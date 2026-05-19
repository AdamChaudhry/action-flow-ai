import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { ActionType } from '../../types/analysis';
import { toDisplayText } from '../../utils/displayText';

interface SimulationTargetActionProps {
  actionTitle: string;
  actionType: ActionType;
  parameters: Record<string, unknown>;
}

/**
 * Shows the "TARGET ACTION" card with the action title, owner, and duration
 * parsed from the simulation parameters.
 */
export const SimulationTargetAction: React.FC<SimulationTargetActionProps> = ({
  actionTitle,
  actionType,
  parameters,
}) => {
  // Safely extract owner/team and duration/deadline from parameters
  const owner = toDisplayText(parameters.owner ?? parameters.team ?? parameters.segment, '-');
  const duration = toDisplayText(parameters.duration ?? parameters.lookbackDays != null
    ? `${parameters.lookbackDays} days`
    : parameters.deadline, '-');

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <FileText size={14} color={colors.aiBlue} />
        </View>
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.tagLabel}>
          TARGET ACTION
        </Typography>
      </View>

      {/* Action title */}
      <Typography variant="headlineMd" style={styles.title}>
        {toDisplayText(actionTitle)}
      </Typography>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Typography variant="labelSm" color={colors.textTertiary}>OWNER</Typography>
          <Typography variant="bodyMd" color={colors.textPrimary}>{owner}</Typography>
        </View>
        <View style={styles.divider} />
        <View style={styles.metaItem}>
          <Typography variant="labelSm" color={colors.textTertiary}>DURATION</Typography>
          <Typography variant="bodyMd" color={colors.textPrimary}>{duration}</Typography>
        </View>
        <View style={styles.divider} />
        <View style={styles.metaItem}>
          <Typography variant="labelSm" color={colors.textTertiary}>TYPE</Typography>
          <Typography variant="bodyMd" color={colors.textPrimary}>
            {toDisplayText(actionType).replace(/_/g, ' ')}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: rounded.sm,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagLabel: {
    letterSpacing: 0.6,
  },
  title: {
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: spacing.stackSm,
    gap: spacing.stackMd,
  },
  metaItem: {
    flex: 1,
    gap: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
});
