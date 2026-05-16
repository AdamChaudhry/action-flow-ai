import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { Typography } from './Typography';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  icon,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.8}
      {...props}
    >
      <Typography
        variant="labelMd"
        color={variant === 'primary' ? colors.primaryInverse : colors.primary}
        style={styles.text}
      >
        {title}
      </Typography>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.gutter,
    borderRadius: rounded.md,
  },
  text: {
    textAlign: 'center',
  },
  iconContainer: {
    marginLeft: spacing.stackSm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.badgeBackground,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});
