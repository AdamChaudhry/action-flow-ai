import React from 'react';
import { Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { Typography } from './Typography';

interface StickyPageActionsProps {
  previousTitle: string;
  nextTitle: string;
  onPrevious?: () => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  nextAccessibilityLabel?: string;
  previousAccessibilityLabel?: string;
}

export const STICKY_PAGE_ACTIONS_HEIGHT = 104;

export const StickyPageActions: React.FC<StickyPageActionsProps> = ({
  previousTitle,
  nextTitle,
  onPrevious,
  onNext,
  isNextDisabled = false,
  isPreviousDisabled = false,
  nextAccessibilityLabel,
  previousAccessibilityLabel,
}) => {
  const previousDisabled = isPreviousDisabled || !onPrevious;
  const nextDisabled = isNextDisabled || !onNext;
  const showPrevious = Boolean(onPrevious);
  const showNext = Boolean(onNext);

  if (!showPrevious && !showNext) {
    return null;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {showPrevious && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={previousAccessibilityLabel ?? `Previous page: ${previousTitle}`}
          accessibilityState={{ disabled: previousDisabled }}
          disabled={previousDisabled}
          onPress={onPrevious}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            previousDisabled && styles.disabledButton,
            pressed && !previousDisabled && styles.pressedButton,
          ]}
        >
          <ArrowLeft size={16} color={previousDisabled ? colors.textTertiary : colors.textPrimary} />
          <Typography
            variant="labelMd"
            color={previousDisabled ? colors.textTertiary : colors.textPrimary}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.buttonLabel}
          >
            {previousTitle}
          </Typography>
        </Pressable>
      )}

      {showNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextAccessibilityLabel ?? `Next page: ${nextTitle}`}
          accessibilityState={{ disabled: nextDisabled }}
          disabled={nextDisabled}
          onPress={onNext}
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            nextDisabled && styles.disabledButton,
            pressed && !nextDisabled && styles.pressedButton,
          ]}
        >
          <Typography
            variant="labelMd"
            color={nextDisabled ? colors.textTertiary : colors.primaryInverse}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.buttonLabel}
          >
            {nextTitle}
          </Typography>
          <ArrowRight size={16} color={nextDisabled ? colors.textTertiary : colors.primaryInverse} />
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    gap: spacing.stackSm,
    minHeight: STICKY_PAGE_ACTIONS_HEIGHT,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.marginMobile,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    flex: 1,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    borderRadius: rounded.md,
    paddingHorizontal: spacing.stackMd,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.border,
  },
  pressedButton: {
    opacity: 0.82,
  },
  buttonLabel: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
  },
});
