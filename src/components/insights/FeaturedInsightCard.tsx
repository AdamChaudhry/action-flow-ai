import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ImportanceBadge } from './ImportanceBadge';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { Insight } from '../../types/analysis';

interface FeaturedInsightCardProps {
  insight: Insight;
}

/**
 * Large, prominent insight card with left blue accent border.
 * Shows confidence, category, importance badges, evidence, and explanation.
 */
export const FeaturedInsightCard: React.FC<FeaturedInsightCardProps> = ({ insight }) => {
  return (
    <View style={styles.wrapper}>
      {/* Left accent line */}
      <View style={styles.accentBar} />

      <View style={styles.body}>
        {/* Badge row */}
        <View style={styles.badgeRow}>
          <ConfidenceBadge value={insight.confidence} />
          <View style={styles.categoryChip}>
            <Typography variant="labelSm" color={colors.textSecondary}>
              {insight.category}
            </Typography>
          </View>
        </View>

        <View style={styles.importanceRow}>
          <ImportanceBadge level={insight.importance} featured />
        </View>

        {/* Headline */}
        <Typography variant="headlineLg" style={styles.title}>
          {insight.title}
        </Typography>

        {/* Evidence */}
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.sectionLabel}>
          EVIDENCE
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary} style={styles.evidenceText}>
          "{insight.evidence}"
        </Typography>

        {/* Explanation */}
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.sectionLabel}>
          EXPLANATION
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary}>
          {insight.whyItMatters}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.aiBlue,
  },
  body: {
    flex: 1,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: 2,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    borderRadius: rounded.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  importanceRow: {
    marginBottom: spacing.stackSm,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  sectionLabel: {
    letterSpacing: 0.6,
    marginTop: spacing.stackMd,
    marginBottom: 4,
  },
  evidenceText: {
    fontStyle: 'italic',
  },
});
