import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { PlusCircle, Share2 } from 'lucide-react-native';

interface HeaderProps {
  onStartAnalysis: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartAnalysis }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.stackMd) }]}>
      <View style={styles.left}>
        <Share2 size={20} color={colors.primary} />
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
