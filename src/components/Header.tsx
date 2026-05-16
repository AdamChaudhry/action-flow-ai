import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Search, Share2 } from 'lucide-react-native';

export const Header: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.stackMd) }]}>
      <View style={styles.left}>
        <Share2 size={20} color={colors.primary} />
        <Typography variant="headlineMd" style={styles.title}>
          ActionFlow AI
        </Typography>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarContainer}>
          {/* Placeholder avatar, normally would use Image component with source */}
          <View style={styles.avatarPlaceholder} />
        </TouchableOpacity>
      </View>
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.stackSm,
  },
  avatarContainer: {
    marginLeft: spacing.stackSm,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
});
