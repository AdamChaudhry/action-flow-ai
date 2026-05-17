import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { rounded } from '../../theme/spacing';
import type { PriorityLevel } from '../../types/analysis';

interface PriorityBadgeProps {
  level: PriorityLevel;
}

const TOKEN: Record<PriorityLevel, { bg: string; text: string; label: string }> = {
  high:   { bg: '#FF6B6B', text: '#FFFFFF', label: 'High Priority' },
  medium: { bg: '#F59E0B', text: '#FFFFFF', label: 'Medium Priority' },
  low:    { bg: '#94A3B8', text: '#FFFFFF', label: 'Low Priority' },
};

/** Small pill badge placed in the top-right of an implication card. */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ level }) => {
  const token = TOKEN[level];

  return (
    <View style={[styles.badge, { backgroundColor: token.bg }]}>
      <Typography variant="labelSm" color={token.text} style={styles.text}>
        {token.label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: rounded.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  text: {
    letterSpacing: 0.2,
  },
});
