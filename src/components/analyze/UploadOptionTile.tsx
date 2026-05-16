import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface UploadOptionTileProps {
  title: string;
  description: string;
  isActive: boolean;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  onPress: () => void;
}

export const UploadOptionTile: React.FC<UploadOptionTileProps> = ({
  title,
  description,
  isActive,
  icon,
  activeIcon,
  onPress,
}) => (
  <TouchableOpacity
    accessibilityLabel={title}
    accessibilityRole="button"
    style={[styles.tile, isActive && styles.tileActive]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={[styles.icon, isActive && styles.iconActive]}>
      {isActive ? activeIcon : icon}
    </View>
    <Typography variant="labelMd" style={styles.title}>
      {title}
    </Typography>
    <Typography variant="labelSm" color={colors.textSecondary} align="center">
      {description}
    </Typography>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.stackMd,
    paddingHorizontal: spacing.stackSm,
    gap: 4,
  },
  tileActive: {
    backgroundColor: colors.badgeBackground,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: rounded.full,
    backgroundColor: colors.badgeBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconActive: {
    backgroundColor: colors.aiBlue,
  },
  title: {
    marginBottom: 2,
  },
});
