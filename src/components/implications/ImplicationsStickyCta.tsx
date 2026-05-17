import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface ImplicationsStickyCtaProps {
  onPress: () => void;
}

export const ImplicationsStickyCta: React.FC<ImplicationsStickyCtaProps> = ({
  onPress,
}) => (
  <View style={styles.wrapper}>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="See actions"
      style={styles.button}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Typography variant="labelMd" color={colors.primaryInverse}>
        See Actions
      </Typography>
      <ArrowRight size={16} color={colors.primaryInverse} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.marginMobile,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    backgroundColor: colors.primary,
    borderRadius: rounded.md,
    paddingVertical: 16,
  },
});
