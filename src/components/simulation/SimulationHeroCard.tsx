import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import { toDisplayText } from '../../utils/displayText';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSimulationId(rawId: string): string {
  // Show last 8 chars formatted as "SF-XXXX-XX"
  const clean = toDisplayText(rawId).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const short  = clean.slice(-8).padStart(8, '0');
  return `SF-${short.slice(0, 4)}-${short.slice(4)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SimulationHeroCardProps {
  actionId: string;
  actionTitle: string;
  /** confidence from ActionSimulation — 0.0 to 1.0 */
  confidence: number;
}

/**
 * Light-background header card that matches the updated design:
 * - Small "SIMULATION ID" label
 * - Large bold title "Simulation Result: <actionTitle>"
 * - Dark pill badge showing confidence %
 */
export const SimulationHeroCard: React.FC<SimulationHeroCardProps> = ({
  actionId,
  actionTitle,
  confidence,
}) => {
  const pct = Math.round(confidence * 100);
  const simId = formatSimulationId(actionId);

  return (
    <View style={styles.card}>
      {/* Simulation ID label */}
      <Typography variant="labelSm" color={colors.textTertiary} style={styles.idLabel}>
        SIMULATION ID: {simId}
      </Typography>

      {/* Main title */}
      <Typography variant="headlineLg" style={styles.title}>
        Simulation Result: {toDisplayText(actionTitle)}
      </Typography>

      {/* Confidence pill */}
      <View style={styles.confidenceBadge}>
        <Typography variant="labelMd" color="#FFFFFF">
          {pct}% Confidence
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
  },
  idLabel: {
    letterSpacing: 0.5,
  },
  title: {
    lineHeight: 34,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: rounded.full,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 4,
  },
});
