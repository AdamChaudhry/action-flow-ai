import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded } from '../../theme/spacing';

interface ConfidenceBadgeProps {
  /** Value from 0 to 1 */
  value: number;
}

/** Displays "89% Confidence" as a soft outlined pill */
export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ value }) => {
  const percent = Math.round(value <= 1 ? value * 100 : value);

  return (
    <View style={styles.container}>
      <Typography variant="labelSm" color={colors.textSecondary}>
        {percent}% Confidence
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: rounded.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceContainerLow,
  },
});
