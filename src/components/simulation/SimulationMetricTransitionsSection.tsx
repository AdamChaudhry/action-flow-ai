import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { spacing } from '../../theme/spacing';
import type { SimulatedChange } from '../../types/analysis';
import { MetricTransitionCard } from './MetricTransitionCard';

interface SimulationMetricTransitionsSectionProps {
  changes: SimulatedChange[];
}

export const SimulationMetricTransitionsSection: React.FC<
  SimulationMetricTransitionsSectionProps
> = ({ changes }) => {
  if (changes.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Typography variant="headlineMd" style={styles.title}>
        Expected Metric Transitions
      </Typography>
      {changes.map((change, index) => (
        <MetricTransitionCard key={`${change.metric}-${index}`} change={change} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: spacing.stackSm,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
});
