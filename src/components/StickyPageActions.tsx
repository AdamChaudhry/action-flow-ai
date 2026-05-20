import React from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { Typography } from './Typography';

interface StickyPageActionsProps {
  nextTitle: string;
  onNext?: () => void;
  isNextDisabled?: boolean;
  isNextBusy?: boolean;
  busyNextTitle?: string;
  nextAccessibilityLabel?: string;
}

export const STICKY_PAGE_ACTIONS_HEIGHT = 104;

export const StickyPageActions: React.FC<StickyPageActionsProps> = ({
  nextTitle,
  onNext,
  isNextDisabled = false,
  isNextBusy = false,
  busyNextTitle,
  nextAccessibilityLabel,
}) => {
  const nextDisabled = isNextDisabled || !onNext;
  const showNext = Boolean(onNext);
  const label = isNextBusy ? busyNextTitle ?? nextTitle : nextTitle;

  if (!showNext) {
    return null;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {showNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextAccessibilityLabel ?? label}
          accessibilityState={{ disabled: nextDisabled, busy: isNextBusy }}
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
            {label}
          </Typography>
          {isNextBusy ? (
            <ActivityIndicator size="small" color={colors.primaryInverse} />
          ) : (
            <ArrowRight size={16} color={nextDisabled ? colors.textTertiary : colors.primaryInverse} />
          )}
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
