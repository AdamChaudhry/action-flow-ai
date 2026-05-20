import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AlertTriangle,
  Clock,
  Layers,
  type LucideIcon,
} from 'lucide-react-native';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { Implication, ImplicationSeverity, ImplicationUrgency } from '../../types/analysis';
import { toDisplayText, toDisplayTextArray } from '../../utils/displayText';

// ─── Severity token ───────────────────────────────────────────────────────────

interface SeverityToken {
  bg: string;
  text: string;
  label: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const SEVERITY_TOKEN: Record<ImplicationSeverity, SeverityToken> = {
  critical: { bg: '#FF6B6B', text: '#FFFFFF', label: 'Critical',  Icon: AlertTriangle, iconBg: '#FEF2F2', iconColor: '#DC2626' },
  high:     { bg: '#F59E0B', text: '#FFFFFF', label: 'High',      Icon: AlertTriangle, iconBg: '#FEF3C7', iconColor: '#D97706' },
  medium:   { bg: '#0F172A', text: '#FFFFFF', label: 'Medium',    Icon: Layers,        iconBg: '#EFF6FF', iconColor: '#2563EB' },
  low:      { bg: '#94A3B8', text: '#FFFFFF', label: 'Low',       Icon: Layers,        iconBg: '#F8FAFC', iconColor: '#64748B' },
};

// ─── Urgency badge ────────────────────────────────────────────────────────────

const URGENCY_COLOR: Record<ImplicationUrgency, string> = {
  high:   '#DC2626',
  medium: '#D97706',
  low:    '#64748B',
};

const UrgencyChip: React.FC<{ urgency: ImplicationUrgency }> = ({ urgency }) => (
  <View style={[chipStyles.chip, { borderColor: URGENCY_COLOR[urgency] }]}>
    <Clock size={10} color={URGENCY_COLOR[urgency]} />
    <Typography variant="labelSm" color={URGENCY_COLOR[urgency]} style={chipStyles.text}>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Urgency
    </Typography>
  </View>
);

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: rounded.full,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  text: { letterSpacing: 0.1 },
});

// ─── Affected areas pills ────────────────────────────────────────────────────

const AreaPills: React.FC<{ areas: string[] }> = ({ areas }) => (
  <View style={areaStyles.row}>
    {areas.slice(0, 4).map(area => (
      <View key={area} style={areaStyles.pill}>
        <Typography variant="labelSm" color={colors.textSecondary}>
          {area}
        </Typography>
      </View>
    ))}
    {areas.length > 4 && (
      <Typography variant="labelSm" color={colors.textTertiary}>
        +{areas.length - 4} more
      </Typography>
    )}
  </View>
);

const areaStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
});

// ─── Main component ───────────────────────────────────────────────────────────

interface ImplicationCardProps {
  implication: Implication;
  onViewActions: (implicationId: string) => void;
}

/**
 * Card for a single business implication using the real API shape:
 *   severity, urgency, businessImpact, affectedAreas, relatedInsightIds
 */
export const ImplicationCard: React.FC<ImplicationCardProps> = ({
  implication,
  onViewActions,
}) => {
  const token = SEVERITY_TOKEN[implication.severity];
  const { Icon } = token;
  const affectedAreas = toDisplayTextArray(implication.affectedAreas);
  const relatedInsightIds = toDisplayTextArray(implication.relatedInsightIds);

  return (
    <View style={styles.card}>
      {/* ── Top row: icon box + severity badge ─── */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: token.iconBg }]}>
          <Icon size={20} color={token.iconColor} />
        </View>
        <View style={[styles.severityBadge, { backgroundColor: token.bg }]}>
          <Typography variant="labelSm" color={token.text} style={styles.severityText}>
            {token.label} Severity
          </Typography>
        </View>
      </View>

      {/* ── Business impact ────────────────────── */}
      <Typography variant="bodyMd" color={colors.textPrimary} style={styles.impact}>
        {toDisplayText(implication.businessImpact)}
      </Typography>

      {/* ── Affected areas ─────────────────────── */}
      {affectedAreas.length > 0 && (
        <View style={styles.section}>
          <Typography variant="labelSm" color={colors.textTertiary} style={styles.sectionLabel}>
            AFFECTED AREAS
          </Typography>
          <AreaPills areas={affectedAreas} />
        </View>
      )}

      {/* ── Footer: urgency chip + insight count ─ */}
      <View style={styles.footer}>
        <UrgencyChip urgency={implication.urgency} />
        {relatedInsightIds.length > 0 && (
          <Typography variant="labelSm" color={colors.textTertiary}>
            {relatedInsightIds.length} insight{relatedInsightIds.length > 1 ? 's' : ''}
          </Typography>
        )}
      </View>

      <View style={styles.actionFooter}>
        <Button
          title="View Actions"
          onPress={() => onViewActions(implication.id)}
          variant="secondary"
        />
      </View>
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
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.stackMd,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: rounded.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityBadge: {
    borderRadius: rounded.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  severityText: { letterSpacing: 0.2 },
  impact: {
    lineHeight: 24,
    marginBottom: spacing.stackMd,
  },
  section: {
    marginBottom: spacing.stackMd,
  },
  sectionLabel: {
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.stackSm,
  },
  actionFooter: {
    marginTop: spacing.stackMd,
    paddingTop: spacing.stackSm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
