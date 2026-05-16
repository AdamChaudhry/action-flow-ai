import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded } from '../../theme/spacing';

interface AttachmentChipProps {
  label: string;
  onClear: () => void;
}

export const AttachmentChip: React.FC<AttachmentChipProps> = ({
  label,
  onClear,
}) => (
  <View style={styles.container}>
    <Typography
      variant="labelSm"
      color={colors.aiBlue}
      numberOfLines={1}
      style={styles.label}
    >
      {label}
    </Typography>
    <TouchableOpacity
      accessibilityLabel={`Remove ${label}`}
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={onClear}
    >
      <X size={12} color={colors.aiBlue} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.badgeBackground,
    borderRadius: rounded.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  label: {
    flex: 1,
  },
});
