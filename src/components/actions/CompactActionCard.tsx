import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { RecommendedAction, ActionPriority } from '../../types/analysis';

// ─── Priority chip ────────────────────────────────────────────────────────────

const CHIP_TOKEN: Record<ActionPriority, { bg: string; text: string; label: string }> = {
  critical: { bg: '#FEF2F2', text: '#DC2626', label: 'CRITICAL' },
  high:     { bg: '#FEF3C7', text: '#D97706', label: 'HIGH' },
  medium:   { bg: '#0F172A', text: '#FFFFFF', label: 'MEDIUM' },
  low:      { bg: '#F1F5F9', text: '#64748B', label: 'LOW' },
};

const PriorityChip: React.FC<{ priority: ActionPriority }> = ({ priority }) => {
  const token = CHIP_TOKEN[priority];
  return (
    <View style={[chip.container, { backgroundColor: token.bg }]}>
      <Typography variant="labelSm" color={token.text} style={chip.text}>{token.label}</Typography>
    </View>
  );
};

const chip = StyleSheet.create({
  container: { borderRadius: rounded.full, paddingVertical: 2, paddingHorizontal: 8, alignSelf: 'flex-start' },
  text:      { letterSpacing: 0.4 },
});

// ─── Component ────────────────────────────────────────────────────────────────

interface CompactActionCardProps {
  action: RecommendedAction;
  onPress?: () => void;
}

/**
 * Compact action card — for auto-executable actions (requiresHumanApproval = false).
 * Shows priority chip, title, and expected impact.
 */
export const CompactActionCard: React.FC<CompactActionCardProps> = ({
  action,
  onPress,
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Feature action: ${action.title}`}
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    onPress={onPress}
  >
    {/* ── Header: priority chip ─────────────── */}
    <PriorityChip priority={action.priority} />

    {/* ── Title ────────────────────────────── */}
    <Typography variant="headlineMd" style={styles.title}>
      {action.title}
    </Typography>

    {/* ── Expected impact as subtitle ────────── */}
    <Typography variant="bodySm" color={colors.textSecondary} style={styles.impact}>
      {action.expectedImpact}
    </Typography>

  </Pressable>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    borderColor: colors.aiBlue,
  },
  title: {
    lineHeight: 24,
  },
  impact: {
    lineHeight: 20,
  },
});
