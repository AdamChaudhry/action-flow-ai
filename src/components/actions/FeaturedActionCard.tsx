import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  CheckCircle,
  RefreshCw,
  Edit2,
  AlertCircle,
} from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { RecommendedAction, ActionPriority } from '../../types/analysis';

// ─── Priority badge ───────────────────────────────────────────────────────────

const PRIORITY_TOKEN: Record<ActionPriority, { bg: string; text: string; label: string }> = {
  critical: { bg: '#EF4444', text: '#FFFFFF', label: 'Critical Priority' },
  high:     { bg: '#F87171', text: '#FFFFFF', label: 'High Priority' },
  medium:   { bg: '#0F172A', text: '#FFFFFF', label: 'Medium Priority' },
  low:      { bg: '#94A3B8', text: '#FFFFFF', label: 'Low Priority' },
};

const PriorityBadge: React.FC<{ priority: ActionPriority }> = ({ priority }) => {
  const token = PRIORITY_TOKEN[priority];
  return (
    <View style={[badge.container, { backgroundColor: token.bg }]}>
      <Typography variant="labelSm" color={token.text}>{token.label}</Typography>
    </View>
  );
};

const badge = StyleSheet.create({
  container: { borderRadius: rounded.full, paddingVertical: 3, paddingHorizontal: 10, alignSelf: 'flex-start' },
});

// ─── Impact / Effort / Risk row ───────────────────────────────────────────────

type Level = 'high' | 'medium' | 'low';

const LEVEL_COLOR: Record<Level, string> = {
  high:   '#059669',
  medium: '#D97706',
  low:    '#3B82F6',
};

const MetricRow: React.FC<{ label: string; value: Level }> = ({ label, value }) => (
  <View style={metric.row}>
    <Typography variant="labelSm" color={colors.textTertiary} style={metric.label}>
      {label}
    </Typography>
    <View style={metric.valueRow}>
      <View style={[metric.dot, { backgroundColor: LEVEL_COLOR[value] }]} />
      <Typography variant="bodyMd" color={LEVEL_COLOR[value]} style={metric.valueText}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Typography>
    </View>
  </View>
);

const metric = StyleSheet.create({
  row:       { marginBottom: 6 },
  label:     { letterSpacing: 0.6, marginBottom: 3 },
  valueRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:       { width: 7, height: 7, borderRadius: 4 },
  valueText: { fontWeight: '600' },
});

// ─── Derive display values from spec fields ───────────────────────────────────

function deriveImpactLevel(expectedImpact: string): Level {
  const lower = expectedImpact.toLowerCase();
  if (lower.includes('significant') || lower.includes('critical') || lower.includes('major')) { return 'high'; }
  if (lower.includes('moderate') || lower.includes('medium')) { return 'medium'; }
  return 'high'; // Default to high for featured actions
}

function deriveEffortLevel(priority: ActionPriority): Level {
  if (priority === 'critical' || priority === 'high') { return 'medium'; }
  return 'low';
}

function deriveRiskLevel(priority: ActionPriority): Level {
  if (priority === 'critical') { return 'high'; }
  if (priority === 'high')     { return 'medium'; }
  return 'low';
}

// ─── Action buttons ───────────────────────────────────────────────────────────

interface ActionButtonsProps {
  requiresHumanApproval: boolean;
  onApprove?: () => void;
  onSimulate?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  requiresHumanApproval,
  onApprove,
  onSimulate,
  onEdit,
  onReject,
}) => (
  <View>
    {requiresHumanApproval ? (
      <>
        {/* Primary row: Approve + Simulate */}
        <View style={btn.primaryRow}>
          <TouchableOpacity style={btn.approveBtn} onPress={onApprove} activeOpacity={0.8}>
            <CheckCircle size={14} color="#FFFFFF" />
            <Typography variant="labelMd" color="#FFFFFF">Approve</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={btn.simulateBtn} onPress={onSimulate} activeOpacity={0.8}>
            <RefreshCw size={14} color={colors.textPrimary} />
            <Typography variant="labelMd" color={colors.textPrimary}>Simulate</Typography>
          </TouchableOpacity>
        </View>
        {/* Secondary row: Edit + Reject */}
        <View style={btn.secondaryRow}>
          <TouchableOpacity style={btn.editBtn} onPress={onEdit} activeOpacity={0.7}>
            <Edit2 size={12} color={colors.textSecondary} />
            <Typography variant="labelSm" color={colors.textSecondary}>Edit</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={onReject} activeOpacity={0.7}>
            <Typography variant="labelSm" color="#EF4444">Reject</Typography>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <TouchableOpacity style={btn.simulateBtn} onPress={onSimulate} activeOpacity={0.8}>
        <RefreshCw size={14} color={colors.textPrimary} />
        <Typography variant="labelMd" color={colors.textPrimary}>Simulate</Typography>
      </TouchableOpacity>
    )}
  </View>
);

const btn = StyleSheet.create({
  primaryRow: { flexDirection: 'row', gap: spacing.stackSm, marginBottom: spacing.stackSm },
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: rounded.md,
    paddingVertical: 12,
  },
  simulateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: rounded.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

// ─── Featured Action Card ─────────────────────────────────────────────────────

interface FeaturedActionCardProps {
  action: RecommendedAction;
}

/**
 * Large, primary action card — shown for requiresHumanApproval = true actions.
 * Displays: priority badge, title, expected impact/effort/risk metrics,
 * description quote block, and Approve/Simulate/Edit/Reject buttons.
 */
export const FeaturedActionCard: React.FC<FeaturedActionCardProps> = ({ action }) => {
  const impactLevel = deriveImpactLevel(action.expectedImpact);
  const effortLevel = deriveEffortLevel(action.priority);
  const riskLevel   = deriveRiskLevel(action.priority);

  return (
    <View style={styles.card}>
      {/* ── Priority badge ───────────────── */}
      <PriorityBadge priority={action.priority} />

      {/* ── Title ───────────────────────── */}
      <Typography variant="headlineLg" style={styles.title}>
        {action.title}
      </Typography>

      {/* ── Metrics ─────────────────────── */}
      <View style={styles.metricsSection}>
        <MetricRow label="EXPECTED IMPACT" value={impactLevel} />
        <MetricRow label="EFFORT" value={effortLevel} />
        <MetricRow label="RISK" value={riskLevel} />
      </View>

      {/* ── Description quote ────────────── */}
      <View style={styles.quoteBlock}>
        <AlertCircle size={14} color={colors.aiBlue} style={styles.quoteIcon} />
        <View style={styles.quoteBody}>
          <Typography variant="bodySm" color={colors.textSecondary} style={styles.quoteText}>
            "{action.description}"
          </Typography>
          {/* Blue progress bar */}
          <View style={styles.progressBar} />
        </View>
      </View>

      {/* ── Action buttons ───────────────── */}
      <ActionButtons requiresHumanApproval={action.requiresHumanApproval} />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackMd,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  title: {
    lineHeight: 32,
  },
  metricsSection: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.md,
    padding: spacing.stackMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteBlock: {
    flexDirection: 'row',
    gap: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.md,
    padding: spacing.stackMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteIcon: {
    marginTop: 2,
  },
  quoteBody: {
    flex: 1,
    gap: spacing.stackSm,
  },
  quoteText: {
    lineHeight: 20,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.aiBlue,
    borderRadius: rounded.full,
    width: '60%',
    marginTop: spacing.stackSm,
  },
});
