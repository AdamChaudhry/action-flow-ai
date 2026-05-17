import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface InsightsLoadingStateProps {
  message?: string;
}

interface InsightsFeedbackStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export const InsightsLoadingState: React.FC<InsightsLoadingStateProps> = ({
  message = 'Loading insights...',
}) => (
  <View style={styles.centeredContainer}>
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

export const InsightsFeedbackState: React.FC<InsightsFeedbackStateProps> = ({
  title,
  message,
  onRetry,
}) => (
  <View style={styles.stateContainer}>
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
      accessibilityLabel="Retry loading insights"
      style={styles.retryButton}
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
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.stackMd,
  },
  loadingText: {
    marginTop: spacing.stackSm,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.gutter,
    backgroundColor: colors.background,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    marginBottom: spacing.stackLg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: rounded.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.gutter,
  },
});
