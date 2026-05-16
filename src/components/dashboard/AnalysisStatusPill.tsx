import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface AnalysisStatusPillProps {
  label: string;
}

export const AnalysisStatusPill: React.FC<AnalysisStatusPillProps> = ({
  label,
}) => (
  <View accessibilityLabel={label} style={styles.container}>
    <View style={styles.dot} />
    <Typography variant="labelSm" color={colors.textPrimary}>
      {label}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: rounded.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.stackLg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.aiBlue,
    marginRight: 8,
  },
});
