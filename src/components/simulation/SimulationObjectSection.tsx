import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface SimulationObjectSectionProps {
  title: string;
  data: Record<string, unknown>;
}

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'unknown';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

export const SimulationObjectSection: React.FC<SimulationObjectSectionProps> = ({
  title,
  data,
}) => {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Typography variant="headlineMd" style={styles.title}>
        {title}
      </Typography>
      {entries.map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Typography variant="labelSm" color={colors.textTertiary} style={styles.key}>
            {formatKey(key)}
          </Typography>
          <Typography variant="bodyMd" color={colors.textPrimary} style={styles.value}>
            {formatValue(value)}
          </Typography>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  row: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.stackMd,
    gap: 4,
  },
  key: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  value: {
    lineHeight: 22,
  },
});
