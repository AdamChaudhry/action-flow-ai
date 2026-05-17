import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface ImplicationsLoadingStateProps {
  message?: string;
}

interface ImplicationsFeedbackStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export const ImplicationsLoadingState: React.FC<
  ImplicationsLoadingStateProps
> = ({ message = 'Loading implications...' }) => (
  <View style={styles.center}>
    <ActivityIndicator size="large" color={colors.aiBlue} />
    <Typography
      variant="bodyMd"
      color={colors.textSecondary}
      style={styles.loadingText}
    >
      {message}
    </Typography>
  </View>
);

export const ImplicationsFeedbackState: React.FC<
  ImplicationsFeedbackStateProps
> = ({ title, message, onRetry }) => (
  <View style={styles.center}>
    <Typography variant="headlineMd" align="center" style={styles.title}>
      {title}
    </Typography>
    <Typography
      variant="bodyMd"
      color={colors.textSecondary}
      align="center"
      style={styles.subtitle}
    >
      {message}
    </Typography>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Retry loading implications"
      style={styles.button}
      onPress={onRetry}
      activeOpacity={0.7}
    >
      <Typography variant="labelMd" color={colors.primaryInverse}>
        Retry
      </Typography>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.gutter,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.stackSm,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    marginBottom: spacing.stackLg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: rounded.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.gutter,
  },
});
