import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { spacing } from '../../theme/spacing';
import type { SimulatedChange } from '../../types/analysis';
import { toDisplayText } from '../../utils/displayText';
import { MetricTransitionCard } from './MetricTransitionCard';

interface SimulationMetricTransitionsSectionProps {
  changes: SimulatedChange[];
}

export const SimulationMetricTransitionsSection: React.FC<
  SimulationMetricTransitionsSectionProps
> = ({ changes }) => {
  const visibleChanges = changes.filter(change => !hasUnknownMetricValue(change));

  if (visibleChanges.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Typography variant="headlineMd" style={styles.title}>
        Expected Metric Transitions
      </Typography>
      {visibleChanges.map((change, index) => (
        <MetricTransitionCard key={`${change.metric}-${index}`} change={change} />
      ))}
    </View>
  );
};

function hasUnknownMetricValue(change: SimulatedChange): boolean {
  return [
    change.metric,
    change.before,
    change.after,
    change.direction,
  ].some(value => toDisplayText(value).trim().toLowerCase() === 'unknown');
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.stackSm,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
});
