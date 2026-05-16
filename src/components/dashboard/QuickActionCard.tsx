import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography';
import { Card } from '../Card';
import { rounded, spacing } from '../../theme/spacing';

interface QuickActionCardProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  label,
  icon,
  onPress,
}) => (
  <TouchableOpacity
    accessibilityLabel={label}
    accessibilityRole="button"
    activeOpacity={0.75}
    style={styles.touchTarget}
    onPress={onPress}
  >
    <Card style={styles.card}>
      {icon}
      <Typography variant="labelMd" style={styles.label}>
        {label}
      </Typography>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  touchTarget: {
    width: '48%',
    marginBottom: spacing.stackMd,
  },
  card: {
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.stackLg,
    borderRadius: rounded.lg,
  },
  label: {
    marginTop: spacing.stackSm,
    textAlign: 'center',
  },
});
