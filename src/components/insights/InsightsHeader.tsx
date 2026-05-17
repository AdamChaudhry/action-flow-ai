import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface InsightsHeaderProps {
  insightCount: number;
}

/**
 * Screen header for the Key Insights screen.
 * Shows the title and a dynamic subtitle based on insight count.
 */
export const InsightsHeader: React.FC<InsightsHeaderProps> = ({ insightCount }) => {
  const dataPoints = insightCount > 0
    ? (insightCount * 248).toLocaleString()
    : '0';

  return (
    <View style={styles.container}>
      <Typography variant="headlineLg" style={styles.title}>
        Key Insights
      </Typography>
      <Typography variant="bodyMd" color={colors.textSecondary} style={styles.subtitle}>
        ActionFlow AI synthesized {dataPoints} data points to identify{' '}
        {insightCount > 0
          ? `these ${insightCount} critical pattern${insightCount > 1 ? 's' : ''}.`
          : 'critical patterns.'}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.stackMd,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    lineHeight: 24,
  },
});
