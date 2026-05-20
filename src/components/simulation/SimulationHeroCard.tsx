import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import { toDisplayText } from '../../utils/displayText';

interface SimulationHeroCardProps {
  simulationId: string;
  actionTitle: string;
  /** confidence from ActionSimulation — 0.0 to 1.0 */
  confidence: number;
}

/**
 * Title card for the Simulation Result screen:
 *   - "Simulation Result" — small label
 *   - Action name — large headline
 *   - Actual Firestore simulation ID
 *   - Confidence pill badge
 */
export const SimulationHeroCard: React.FC<SimulationHeroCardProps> = ({
  simulationId,
  actionTitle,
  confidence,
}) => {
  const pct = Math.round(confidence * 100);

  return (
    <View style={styles.card}>
      {/* Screen label */}
      <Typography variant="labelMd" color={colors.textSecondary} style={styles.screenLabel}>
        Simulation Result
      </Typography>

      {/* Action title — main headline */}
      <Typography variant="headlineLg" style={styles.title}>
        {toDisplayText(actionTitle)}
      </Typography>

      {/* Real Firestore simulation ID */}
      <Typography variant="labelSm" color={colors.textTertiary} style={styles.idLabel}>
        ID: {simulationId}
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
  screenLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    lineHeight: 34,
  },
  idLabel: {
    letterSpacing: 0.3,
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
