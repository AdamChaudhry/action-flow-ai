import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'outlined',
  glass = false,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.base,
        variant === 'outlined' && styles.outlined,
        variant === 'elevated' && styles.elevated,
        glass && styles.glass,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: rounded.md,
    padding: spacing.stackMd,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    // In React Native, true backdrop blur requires specific native modules (like @react-native-community/blur)
    // We will simulate it with a solid-ish background and no borders for now.
    borderRadius: rounded.xl,
    borderWidth: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 4,
  },
});
