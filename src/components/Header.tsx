import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { PlusCircle } from 'lucide-react-native';

interface HeaderProps {
  onStartAnalysis: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartAnalysis }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.stackMd) }]}>
      <View style={styles.left}>
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
