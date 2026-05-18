import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';

interface SimulationProjectedOutcomeProps {
  text: string;
}

/**
 * White card showing the projected outcome string from ActionSimulation.projectedOutcome.
 */
export const SimulationProjectedOutcome: React.FC<SimulationProjectedOutcomeProps> = ({
  text,
}) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <FileText size={16} color={colors.textSecondary} />
      <Typography variant="labelMd" color={colors.textSecondary} style={styles.label}>
        Projected Outcome
      </Typography>
    </View>
    <Typography variant="bodyMd" color={colors.textSecondary} style={styles.text}>
      {text}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  label:  { letterSpacing: 0.2 },
  text:   { lineHeight: 24 },
});
