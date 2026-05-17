import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { ImportanceBadge } from './ImportanceBadge';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { Insight } from '../../types/analysis';

interface CompactInsightCardProps {
  insight: Insight;
}

/**
 * Secondary insight card — compact row layout with importance pill,
 * title, summary, progress bar, and reliability percentage.
 */
export const CompactInsightCard: React.FC<CompactInsightCardProps> = ({ insight }) => {
  const reliabilityPercent = Math.round(
    insight.confidence <= 1 ? insight.confidence * 100 : insight.confidence,
  );

  return (
    <View style={styles.card}>
      {/* Header row: importance pill + category */}
      <View style={styles.headerRow}>
        <ImportanceBadge level={insight.importance} />
        <Typography variant="bodySm" color={colors.textSecondary} style={styles.category}>
          {insight.category}
        </Typography>
      </View>

      {/* Title */}
      <Typography variant="headlineMd" style={styles.title}>
        {insight.title}
      </Typography>

      {/* Summary */}
      <Typography variant="bodySm" color={colors.textSecondary} style={styles.summary}>
        {insight.summary}
      </Typography>

      {/* Reliability bar */}
      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${reliabilityPercent}%` }]} />
        </View>
        <Typography variant="labelSm" color={colors.textSecondary}>
          {reliabilityPercent}% Reliable
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    flexWrap: 'wrap',
  },
  category: {
    flex: 1,
  },
  title: {
    lineHeight: 28,
  },
  summary: {
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginTop: spacing.stackSm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: rounded.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.aiBlue,
    borderRadius: rounded.full,
  },
});
