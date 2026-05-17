import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { SimulatedChange } from '../../types/analysis';

// ─── Change badge ─────────────────────────────────────────────────────────────

type ChangeType = 'increase' | 'decrease' | 'no_change' | 'unknown';

const CHANGE_TOKEN: Record<ChangeType, { bg: string; text: string; Icon: typeof TrendingUp; label: string }> = {
  increase:  { bg: '#D1FAE5', text: '#059669', Icon: TrendingUp,  label: 'Increase' },
  decrease:  { bg: '#FEE2E2', text: '#DC2626', Icon: TrendingDown, label: 'Decrease' },
  no_change: { bg: '#F1F5F9', text: '#64748B', Icon: Minus,        label: 'No Change' },
  unknown:   { bg: '#F1F5F9', text: '#64748B', Icon: Minus,        label: 'Unknown' },
};

const ChangeBadge: React.FC<{ direction: ChangeType; confidence: number }> = ({ direction, confidence }) => {
  const token = CHANGE_TOKEN[direction];
  const { Icon } = token;
  const pct = Math.round(confidence * 100);
  return (
    <View style={[badge.container, { backgroundColor: token.bg }]}>
      <Icon size={11} color={token.text} />
      <Typography variant="labelSm" color={token.text}>{token.label}</Typography>
      <Typography variant="labelSm" color={token.text} style={badge.conf}>({pct}%)</Typography>
    </View>
  );
};

const badge = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: rounded.full, paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start' },
  conf: { opacity: 0.75 },
});

// ─── Metric Transition Card ───────────────────────────────────────────────────

interface MetricTransitionCardProps {
  change: SimulatedChange;
}

/**
 * Renders a single SimulatedChange from the API:
 * metric label, before → after values, direction badge, rationale.
 */
export const MetricTransitionCard: React.FC<MetricTransitionCardProps> = ({ change }) => (
  <View style={styles.card}>
    {/* Header */}
    <View style={styles.headerRow}>
      <Typography variant="headlineMd" style={styles.metric}>{change.metric}</Typography>
      <ChangeBadge direction={change.direction} confidence={change.confidence} />
    </View>

    {/* Before → After */}
    <View style={styles.transitionRow}>
      <View style={styles.transitionItem}>
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.transitionLabel}>BEFORE</Typography>
        <Typography variant="bodyMd" color={colors.textSecondary}>{String(change.before ?? '—')}</Typography>
      </View>
      <Typography variant="labelSm" color={colors.textTertiary} style={styles.arrow}>→</Typography>
      <View style={styles.transitionItem}>
        <Typography variant="labelSm" color={colors.textTertiary} style={styles.transitionLabel}>AFTER</Typography>
        <Typography variant="bodyMd" color={colors.aiBlue} style={styles.afterValue}>{String(change.after ?? '—')}</Typography>
      </View>
    </View>

    {/* Rationale */}
    <Typography variant="bodySm" color={colors.textSecondary} style={styles.rationale}>
      {change.rationale}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  headerRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: spacing.stackSm },
  metric:         { flex: 1, textTransform: 'capitalize' },
  transitionRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd },
  transitionItem: { gap: 2 },
  transitionLabel:{ letterSpacing: 0.5 },
  arrow:          { paddingTop: 14 },
  afterValue:     { fontWeight: '600' },
  rationale:      { lineHeight: 18, marginTop: spacing.stackSm },
});
