import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { SimulatedChange } from '../../types/analysis';
import { toDisplayText } from '../../utils/displayText';

// ─── Direction badge ──────────────────────────────────────────────────────────

type Direction = SimulatedChange['direction'];

const DIRECTION_TOKEN: Record<Direction, { bg: string; text: string }> = {
  increase:  { bg: '#D1FAE5', text: '#059669' },
  decrease:  { bg: '#FEE2E2', text: '#DC2626' },
  no_change: { bg: '#F1F5F9', text: '#64748B' },
  unknown:   { bg: '#F1F5F9', text: '#64748B' },
};

/** Formats the `after` value as a human-readable label */
function directionLabel(after: SimulatedChange['after']): string {
  if (after === null || after === undefined) { return 'Unknown'; }
  const s = toDisplayText(after);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Metric name formatter ────────────────────────────────────────────────────

function formatMetricName(metric: string): string {
  return toDisplayText(metric)
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface MetricTransitionCardProps {
  change: SimulatedChange;
}

/**
 * Renders one SimulatedChange per the updated design:
 * - Row: metric name + "XX% Conf" badge
 * - "Unknown → Improved" with arrow
 * - Rationale text
 */
export const MetricTransitionCard: React.FC<MetricTransitionCardProps> = ({ change }) => {
  const token = DIRECTION_TOKEN[change.direction];
  const pct   = Math.round(change.confidence * 100);
  const label = directionLabel(change.after);
  const beforeLabel = change.before === null || change.before === undefined
    ? 'Unknown'
    : toDisplayText(change.before).charAt(0).toUpperCase() + toDisplayText(change.before).slice(1);

  return (
    <View style={styles.card}>
      {/* Header: metric name + confidence badge */}
      <View style={styles.headerRow}>
        <Typography variant="headlineMd" style={styles.metricName}>
          {formatMetricName(change.metric)}
        </Typography>
        <View style={[styles.confBadge, { backgroundColor: token.bg }]}>
          <Typography variant="labelSm" color={token.text}>
            {pct}% Conf
          </Typography>
        </View>
      </View>

      {/* Before → After */}
      <View style={styles.transitionRow}>
        <Typography variant="bodyMd" color={colors.textSecondary}>
          {beforeLabel}
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary} style={styles.arrow}>
          →
        </Typography>
        <Typography variant="bodyMd" color={token.text} style={styles.afterLabel}>
          {label}
        </Typography>
      </View>

      {/* Rationale */}
      <View style={styles.rationaleRow}>
        <FileText size={12} color={colors.textTertiary} />
        <Typography variant="bodySm" color={colors.textSecondary} style={styles.rationale}>
          {toDisplayText(change.rationale)}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.stackSm,
    flexWrap: 'wrap',
  },
  metricName: {
    flex: 1,
  },
  confBadge: {
    borderRadius: rounded.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  transitionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
  },
  arrow: {
    color: colors.textTertiary,
  },
  afterLabel: {
    fontWeight: '600',
  },
  rationaleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 2,
  },
  rationale: {
    flex: 1,
    lineHeight: 18,
  },
});
