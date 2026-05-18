import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';
import type { ActionType } from '../../types/analysis';

interface SimulationMetadataSectionProps {
  actionType: ActionType | string;
  estimatedRisk: string;
  requiresHumanApproval: boolean;
}

const riskColor: Record<string, string> = {
  low: colors.aiBlue,
  medium: '#D97706',
  high: '#DC2626',
};

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ');
}

export const SimulationMetadataSection: React.FC<
  SimulationMetadataSectionProps
> = ({ actionType, estimatedRisk, requiresHumanApproval }) => {
  const normalizedRisk = estimatedRisk.toLowerCase();
  const riskTextColor = riskColor[normalizedRisk] ?? colors.textSecondary;

  return (
    <View style={styles.container}>
      <Typography variant="headlineMd" style={styles.title}>
        Action Details
      </Typography>

      <View style={styles.row}>
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.label}>
          ACTION TYPE
        </Typography>
        <Typography variant="bodyMd" color={colors.textPrimary} style={styles.value}>
          {formatLabel(actionType)}
        </Typography>
      </View>

      <View style={styles.row}>
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.label}>
          ESTIMATED RISK
        </Typography>
        <View style={[styles.riskPill, { borderColor: riskTextColor }]}>
          <Typography variant="labelSm" color={riskTextColor}>
            {formatLabel(estimatedRisk)}
          </Typography>
        </View>
      </View>

      <View style={styles.row}>
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.label}>
          APPROVAL
        </Typography>
        <Typography variant="bodyMd" color={colors.textPrimary} style={styles.value}>
          {requiresHumanApproval ? 'Human approval required' : 'No approval required'}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackMd,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  row: {
    gap: 4,
  },
  label: {
    letterSpacing: 0.6,
  },
  value: {
    textTransform: 'capitalize',
  },
  riskPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: rounded.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
});
