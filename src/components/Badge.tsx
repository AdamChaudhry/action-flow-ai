import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Typography } from './Typography';
import { colors } from '../theme/colors';
import { rounded } from '../theme/spacing';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'success' | 'outline' | 'ai' | 'neutral';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  icon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typography
        variant="labelSm"
        color={
          variant === 'ai' || variant === 'success' || variant === 'default'
            ? colors.aiBlue
            : colors.textSecondary
        }
      >
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: rounded.full,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  default: {
    backgroundColor: colors.badgeBackground,
  },
  ai: {
    backgroundColor: colors.badgeBackground,
  },
  success: {
    backgroundColor: colors.badgeBackground,
  },
  neutral: {
    backgroundColor: colors.surfaceContainerLow,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
