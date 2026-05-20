import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { ArrowLeft, PlusCircle } from 'lucide-react-native';

interface HeaderProps {
  onStartAnalysis: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onStartAnalysis,
  onBack,
  canGoBack = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.stackMd) }]}>
      <View style={styles.left}>
        {canGoBack && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            activeOpacity={0.75}
            onPress={onBack}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Image
          source={require('../assets/actionflow-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Typography variant="headlineMd" style={styles.title}>
          ActionFlow AI
        </Typography>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Start analysis"
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={onStartAnalysis}
      >
        <PlusCircle size={16} color={colors.primaryInverse} />
        <Typography variant="labelMd" color={colors.primaryInverse}>
          Start Analysis
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.stackMd,
    backgroundColor: colors.background,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.stackSm,
    borderRadius: rounded.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: rounded.sm,
  },
  title: {
    marginLeft: spacing.stackSm,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: rounded.full,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
